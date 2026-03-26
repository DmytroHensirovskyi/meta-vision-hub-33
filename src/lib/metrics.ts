import type { Candle } from "@/types/index";
import type {
  SessionSlice,
  DayOfWeekBar,
  CompressionState,
  SMCMetrics,
} from "@/types/analytics";

// ── Constants ─────────────────────────────────────────────────────────────────
const PIP = 0.0001;
const PIPS = 1 / PIP;
const EST_OFFSET = -5; // EST = UTC-5 (no DST adjustment for deterministic logic)

// Session colours (reference design tokens by value; CSS vars not available here)
const COLORS = {
  hodAsia:   "hsl(355,65%,52%)",   // rose
  hodLondon: "hsl(10,70%,55%)",    // red-orange
  hodNY:     "hsl(340,60%,48%)",   // deep rose
  hodOther:  "hsl(350,30%,38%)",   // muted rose

  lodAsia:   "hsl(152,48%,42%)",   // emerald
  lodLondon: "hsl(170,50%,40%)",   // teal-emerald
  lodNY:     "hsl(138,42%,36%)",   // dark green
  lodOther:  "hsl(155,25%,32%)",   // muted green
} as const;

// ── Time helpers ─────────────────────────────────────────────────────────────
/** Convert an ISO timestamp to EST hour (0-23). */
function estHour(iso: string): number {
  const utcH = new Date(iso).getUTCHours();
  return ((utcH + EST_OFFSET) + 24) % 24;
}

/**
 * Return a string "YYYY-MM-DD" representing the EST calendar date.
 * EST day starts at 00:00 EST (05:00 UTC when no DST).
 */
function estDate(iso: string): string {
  const ms = new Date(iso).getTime() + EST_OFFSET * 3_600_000;
  return new Date(ms).toISOString().slice(0, 10);
}

/** Classify an EST hour into a session. */
type Session = "Asia" | "London" | "NY" | "Other";
function sessionOf(h: number): Session {
  if (h >= 20 || h < 1)   return "Asia";    // 20:00–00:59 EST
  if (h >= 2  && h < 5)   return "London";  // 02:00–04:59 EST
  if (h >= 7  && h < 10)  return "NY";      // 07:00–09:59 EST
  return "Other";
}

/** Group candles into EST calendar days. */
function groupByDay(candles: Candle[]): Map<string, Candle[]> {
  const map = new Map<string, Candle[]>();
  for (const c of candles) {
    const d = estDate(c.time);
    if (!map.has(d)) map.set(d, []);
    map.get(d)!.push(c);
  }
  return map;
}

// ── 1. HOD & LOD Session Distribution ────────────────────────────────────────
export function calculateHodLod(candles: Candle[]): {
  hod: SessionSlice[];
  lod: SessionSlice[];
} {
  const byDay = groupByDay(candles);

  const hodCounts: Record<Session, number> = { Asia: 0, London: 0, NY: 0, Other: 0 };
  const lodCounts: Record<Session, number> = { Asia: 0, London: 0, NY: 0, Other: 0 };

  for (const day of byDay.values()) {
    const hodCandle = day.reduce((a, b) => (b.high > a.high ? b : a));
    const lodCandle = day.reduce((a, b) => (b.low  < a.low  ? b : a));
    hodCounts[sessionOf(estHour(hodCandle.time))]++;
    lodCounts[sessionOf(estHour(lodCandle.time))]++;
  }

  const toSlices = (
    counts: Record<Session, number>,
    palette: { Asia: string; London: string; NY: string; Other: string }
  ): SessionSlice[] => {
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return (["Asia", "London", "NY", "Other"] as Session[]).map(s => ({
      session: s,
      value:   Math.round((counts[s] / total) * 100),
      color:   palette[s],
    }));
  };

  return {
    hod: toSlices(hodCounts, {
      Asia:   COLORS.hodAsia,
      London: COLORS.hodLondon,
      NY:     COLORS.hodNY,
      Other:  COLORS.hodOther,
    }),
    lod: toSlices(lodCounts, {
      Asia:   COLORS.lodAsia,
      London: COLORS.lodLondon,
      NY:     COLORS.lodNY,
      Other:  COLORS.lodOther,
    }),
  };
}

// ── 2. Asian Sweep Probability ────────────────────────────────────────────────
/**
 * For each day:
 *   - Asian window: 20:00–00:59 EST → find Asian Low.
 *   - London window: 02:00–04:59 EST → check if any candle's Low drops below Asian Low (sweep).
 *   - If sweep occurs, check if the daily Close (last candle of day) > Asian Low (bullish reversal).
 * Returns percentage of sweep days that reversed bullishly.
 */
export function calculateAsianSweep(candles: Candle[]): number {
  const byDay = groupByDay(candles);
  const sortedDays = [...byDay.keys()].sort();

  let sweepDays = 0;
  let bullishReversals = 0;

  for (const date of sortedDays) {
    const day = byDay.get(date)!;

    const asianCandles  = day.filter(c => { const h = estHour(c.time); return h >= 20 || h < 1; });
    const londonCandles = day.filter(c => { const h = estHour(c.time); return h >= 2 && h < 5; });

    if (asianCandles.length === 0 || londonCandles.length === 0) continue;

    const asianLow = Math.min(...asianCandles.map(c => c.low));

    const swept = londonCandles.some(c => c.low < asianLow);
    if (!swept) continue;

    sweepDays++;

    // Daily close = close of last candle in the day
    const dailyClose = day[day.length - 1].close;
    if (dailyClose > asianLow) bullishReversals++;
  }

  if (sweepDays === 0) return 0;
  return Math.round((bullishReversals / sweepDays) * 100);
}

// ── 3. Day of Week Profiling ──────────────────────────────────────────────────
const DOW_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export function calculateDayOfWeek(candles: Candle[]): DayOfWeekBar[] {
  const byDay = groupByDay(candles);

  // dow index: 0=Sun,1=Mon,...,6=Sat  → map to Mon-Fri (1-5)
  const counts: Record<string, { bull: number; bear: number }> = {};
  for (const label of DOW_LABELS) counts[label] = { bull: 0, bear: 0 };

  for (const [date, day] of byDay.entries()) {
    const utcDate = new Date(date + "T12:00:00Z");
    const dow = utcDate.getUTCDay(); // 0=Sun
    if (dow === 0 || dow === 6) continue;

    const label = DOW_LABELS[dow - 1];
    const open  = day[0].open;
    const close = day[day.length - 1].close;

    if (close > open) counts[label].bull++;
    else              counts[label].bear++;
  }

  return DOW_LABELS.map(label => {
    const { bull, bear } = counts[label];
    const total = bull + bear || 1;
    return {
      day:     label,
      bullish: Math.round((bull / total) * 100),
      bearish: Math.round((bear / total) * 100),
    };
  });
}

// ── 4. Judas Swing Bias ───────────────────────────────────────────────────────
/**
 * For each day where the London Session Low (02:00–05:00 EST) is strictly
 * below the 00:00 EST candle open (Midnight Open), count how many of those
 * days closed bullishly (Daily Close > Midnight Open).
 */
export function calculateJudasBias(candles: Candle[]): number {
  const byDay = groupByDay(candles);
  const sortedDays = [...byDay.keys()].sort();

  let qualifyingDays = 0;
  let bullishDays    = 0;

  for (const date of sortedDays) {
    const day = byDay.get(date)!;

    // 00:00 EST candle → first candle at EST hour 0
    const midnightCandle = day.find(c => estHour(c.time) === 0);
    if (!midnightCandle) continue;

    const midnightOpen = midnightCandle.open;

    const londonCandles = day.filter(c => { const h = estHour(c.time); return h >= 2 && h < 5; });
    if (londonCandles.length === 0) continue;

    const londonLow = Math.min(...londonCandles.map(c => c.low));

    // Judas Swing condition: London dips below midnight open (discount sweep)
    if (londonLow >= midnightOpen) continue;

    qualifyingDays++;

    const dailyClose = day[day.length - 1].close;
    if (dailyClose > midnightOpen) bullishDays++;
  }

  if (qualifyingDays === 0) return 0;
  return Math.round((bullishDays / qualifyingDays) * 100);
}

// ── 5. Compression / Expansion State ─────────────────────────────────────────
export function calculateCompression(candles: Candle[]): CompressionState {
  const byDay  = groupByDay(candles);
  const sorted = [...byDay.keys()].sort();

  if (sorted.length < 2) return "Neutral";

  // ADR over last 20 completed days (exclude today)
  const completedDays = sorted.slice(0, -1); // all but last (today)
  const last20 = completedDays.slice(-20);

  if (last20.length === 0) return "Neutral";

  const ranges = last20.map(d => {
    const day  = byDay.get(d)!;
    const high = Math.max(...day.map(c => c.high));
    const low  = Math.min(...day.map(c => c.low));
    return (high - low) * PIPS;
  });

  const adr = ranges.reduce((a, b) => a + b, 0) / ranges.length;

  // Yesterday's range
  const yesterday = byDay.get(sorted[sorted.length - 2])!;
  const yHigh = Math.max(...yesterday.map(c => c.high));
  const yLow  = Math.min(...yesterday.map(c => c.low));
  const yRange = (yHigh - yLow) * PIPS;

  if (yRange > adr * 1.2) return "Expected: Chop/Contraction";
  if (yRange < adr * 0.8) return "Expected: Trend/Expansion";
  return "Neutral";
}

// ── Aggregate entry point ─────────────────────────────────────────────────────
export function computeAllMetrics(candles: Candle[]): SMCMetrics {
  const { hod, lod } = calculateHodLod(candles);
  return {
    asianSweepProb:   calculateAsianSweep(candles),
    judasBiasProb:    calculateJudasBias(candles),
    compressionState: calculateCompression(candles),
    hodDistribution:  hod,
    lodDistribution:  lod,
    dayOfWeek:        calculateDayOfWeek(candles),
  };
}
