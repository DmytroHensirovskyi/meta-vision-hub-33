import type { Candle } from "@/types/index";

// ── OANDA endpoint (M15, 5000 candles) ────────────────────────────────────────
const OANDA_URL =
  "https://api-fxpractice.oanda.com/v3/instruments/EUR_USD/candles?count=5000&granularity=M15";

// ── Helpers ───────────────────────────────────────────────────────────────────
function mapOandaCandles(raw: unknown): Candle[] {
  // OANDA v3 shape: { candles: [{ time, mid: { o, h, l, c } }] }
  const body = raw as { candles: Array<{ time: string; mid: { o: string; h: string; l: string; c: string } }> };
  return body.candles.map(c => ({
    time:  c.time,
    open:  parseFloat(c.mid.o),
    high:  parseFloat(c.mid.h),
    low:   parseFloat(c.mid.l),
    close: parseFloat(c.mid.c),
  }));
}

// ── Public API ────────────────────────────────────────────────────────────────
export async function fetchCandles(token: string): Promise<Candle[]> {
  if (!token || token.trim() === "") {
    console.info("[Analytica] No token — returning empty candles (mock data in use).");
    return [];
  }

  try {
    const response = await fetch(OANDA_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn("[Analytica] OANDA returned non-OK status:", response.status);
      return [];
    }

    const raw = await response.json();
    return mapOandaCandles(raw);
  } catch (err) {
    console.warn("[Analytica] Fetch failed:", err);
    return [];
  }
}
