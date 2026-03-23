import type { Candle } from "@/types/index";

// ── Mock Candle Generator ──────────────────────────────────────────────────────
// Generates hourly OHLC candles for N days starting from a base date.
// Each "day" produces 24 hourly candles.  Prices are built with a simple
// random-walk so the data looks realistic to the metrics functions.

function makeHourlyCandles(baseDateISO: string, price: number): Candle[] {
  const candles: Candle[] = [];
  const base = new Date(baseDateISO + "T00:00:00Z");

  for (let h = 0; h < 24; h++) {
    const ts = new Date(base.getTime() + h * 3_600_000).toISOString();
    const move = (Math.random() - 0.49) * 0.0025; // small directional bias
    const open  = price;
    const close = open + move;
    const spread = Math.abs(move) + Math.random() * 0.0030;
    const high  = Math.max(open, close) + spread * 0.5;
    const low   = Math.min(open, close) - spread * 0.5;
    candles.push({
      time:  ts,
      open:  parseFloat(open.toFixed(5)),
      high:  parseFloat(high.toFixed(5)),
      low:   parseFloat(low.toFixed(5)),
      close: parseFloat(close.toFixed(5)),
    });
    price = close;
  }
  return candles;
}

export function generateMockCandles(days = 20): Candle[] {
  const candles: Candle[] = [];
  let price = 1.08450;

  // Work backwards from today
  const today = new Date();
  for (let d = days - 1; d >= 0; d--) {
    const dt = new Date(today.getTime() - d * 86_400_000);
    const iso = dt.toISOString().slice(0, 10); // YYYY-MM-DD
    const dayCandles = makeHourlyCandles(iso, price);
    price = dayCandles[dayCandles.length - 1].close;
    candles.push(...dayCandles);
  }
  return candles;
}
