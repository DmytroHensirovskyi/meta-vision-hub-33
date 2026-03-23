export interface Candle {
  time: string; // ISO 8601 UTC timestamp
  open: number;
  high: number;
  low: number;
  close: number;
}
