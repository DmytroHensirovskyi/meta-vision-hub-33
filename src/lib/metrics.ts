import type { Candle } from "@/types/index";

// ── Constants ──────────────────────────────────────────────────────────────────
const PIP = 0.0001; // 1 pip in Forex decimal terms (4th decimal)
const PIPS_IN_UNIT = 1 / PIP; // multiply price diff by this to get pips

// Session windows in UTC hours (EST = UTC-5)
// Asia:   20:00–00:00 UTC (next day)  ← 15:00–19:00 EST, but spec says "20:00-00:00"
// London: 02:00–05:00 UTC
// NY:     07:00–10:00 UTC  (captures the open overlap / kill-zone)
const SESSIONS = [
  { name: "Asia",   startH: 20, endH: 24 },
  { name: "London", startH: 2,  endH: 5  },
  { name: "NY",     startH: 7,  endH: 10 },
] as const;

const SESSION_COLORS: Record<string, string> = {
  Asia:   "hsl(var(--accent-blue))",
  London: "hsl(var(--accent-emerald))",
  NY:     "hsl(var(--accent-amber))",
};

type SessionName = "Asia" | "London" | "NY";

function utcHour(isoTime: string): number {
  return new Date(isoTime).getUTCHours();
}

/** Normalise an ISO timestamp to just the UTC calendar date (YYYY-MM-DD). */
function utcDate(isoTime: string): string {
  return isoTime.slice(0, 10);
}

// ── 1. HOD / LOD by Session ───────────────────────────────────────────────────
/**
 * For each day, find the candle with the highest High (HOD) and the candle
 * with the lowest Low (LOD), then assign each to one of the three session
 * windows based on its UTC hour.  Returns a Recharts-ready array with the
 * percentage each session contributed plus a chart colour.
 */
export function calculateHodLod(
  candles: Candle[]
): { session: string; value: number; color: string }[] {
  // Group candles by date
  const byDate = new Map<string, Candle[]>();
  for (const c of candles) {
    const d = utcDate(c.time);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(c);
  }

  const sessionCounts: Record<string, number> = {
    Asia: 0, London: 0, NY: 0, Other: 0,
  };

  for (const dayCandls of byDate.values()) {
    const hod = dayCandls.reduce((a, b) => (b.high > a.high ? b : a));
    const lod = dayCandls.reduce((a, b) => (b.low  < a.low  ? b : a));

    for (const extremeCandle of [hod, lod]) {
      const h = utcHour(extremeCandle.time);
      const session = getSession(h);
      sessionCounts[session]++;
    }
  }

  const total = Object.values(sessionCounts).reduce((a, b) => a + b, 0) || 1;

  return SESSIONS.map(({ name }) => ({
    session: name,
    value: Math.round((sessionCounts[name] / total) * 100),
    color: SESSION_COLORS[name],
  }));
}

function getSession(hour: number): SessionName | "Other" {
  if (hour >= 20 || hour < 0)  return "Asia";   // wraps midnight
  if (hour >= 2  && hour < 5)  return "London";
  if (hour >= 7  && hour < 10) return "NY";
  return "Other";
}

// ── 2. Midnight Overlap Probability ──────────────────────────────────────────
/**
 * For each trading day, find the 00:00 UTC candle open price.
 * Check if any candle between 00:00–07:00 UTC deviated ≥ 50 pips from that
 * open before the NY session opens.
 * Returns the percentage of days where this occurred.
 */
export function calculateMidnightOverlap(candles: Candle[]): number {
  const THRESHOLD_PIPS = 50;

  const byDate = new Map<string, Candle[]>();
  for (const c of candles) {
    const d = utcDate(c.time);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(c);
  }

  let qualifyingDays = 0;
  let totalDays = 0;

  for (const dayCandls of byDate.values()) {
    // Find the midnight open (first candle at 00:xx UTC)
    const midnightCandle = dayCandls.find(c => utcHour(c.time) === 0);
    if (!midnightCandle) continue;

    totalDays++;
    const midnightOpen = midnightCandle.open;

    // Check all candles from midnight to 07:00 for a 50-pip deviation
    const preNyCandles = dayCandls.filter(c => {
      const h = utcHour(c.time);
      return h >= 0 && h < 7;
    });

    const expanded = preNyCandles.some(c => {
      const pipsMoved = Math.abs(c.high - midnightOpen) * PIPS_IN_UNIT;
      const pipsDown  = Math.abs(midnightOpen - c.low)  * PIPS_IN_UNIT;
      return pipsMoved >= THRESHOLD_PIPS || pipsDown >= THRESHOLD_PIPS;
    });

    if (expanded) qualifyingDays++;
  }

  if (totalDays === 0) return 0;
  return Math.round((qualifyingDays / totalDays) * 100);
}

// ── 3. Average NY Session Expansion ──────────────────────────────────────────
/**
 * For each of the last 15 trading days, filter candles strictly between
 * 07:00–17:00 UTC (NY session).  Calculate the High-Low pip range for each
 * day and return the daily ranges (for the bar chart) along with the average.
 */
export interface NyExpansionResult {
  average: number;
  daily: { day: string; pips: number }[];
}

export function calculateNyExpansion(candles: Candle[]): NyExpansionResult {
  const byDate = new Map<string, Candle[]>();
  for (const c of candles) {
    const d = utcDate(c.time);
    if (!byDate.has(d)) byDate.set(d, []);
    byDate.get(d)!.push(c);
  }

  const sortedDates = [...byDate.keys()].sort();
  const last15 = sortedDates.slice(-15);

  const daily = last15.map(date => {
    const nyCandles = byDate.get(date)!.filter(c => {
      const h = utcHour(c.time);
      return h >= 7 && h < 17;
    });

    if (nyCandles.length === 0) return { day: fmtDate(date), pips: 0 };

    const high = Math.max(...nyCandles.map(c => c.high));
    const low  = Math.min(...nyCandles.map(c => c.low));
    const pips = Math.round((high - low) * PIPS_IN_UNIT);
    return { day: fmtDate(date), pips };
  });

  const validDays  = daily.filter(d => d.pips > 0);
  const average    = validDays.length
    ? Math.round(validDays.reduce((s, d) => s + d.pips, 0) / validDays.length)
    : 0;

  return { average, daily };
}

function fmtDate(iso: string): string {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
