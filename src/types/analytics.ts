// ── Session Distribution (used by HOD and LOD donuts separately) ──────────────
export interface SessionSlice {
  session: string;
  value: number;
  color: string;
}

// ── Day of Week Profiling ─────────────────────────────────────────────────────
export interface DayOfWeekBar {
  day: string;          // "Mon" | "Tue" | "Wed" | "Thu" | "Fri"
  bullish: number;      // percentage 0-100
  bearish: number;      // percentage 0-100
}

// ── Compression State ─────────────────────────────────────────────────────────
export type CompressionState =
  | "Expected: Chop/Contraction"
  | "Expected: Trend/Expansion"
  | "Neutral";

// ── Full result shape returned by the metrics layer ──────────────────────────
export interface SMCMetrics {
  /** Asian sweep + bullish reversal probability (0-100) */
  asianSweepProb: number;
  /** Judas Swing bullish day bias (0-100) */
  judasBiasProb: number;
  /** ADR compression/expansion classification */
  compressionState: CompressionState;
  /** HOD distribution across sessions */
  hodDistribution: SessionSlice[];
  /** LOD distribution across sessions */
  lodDistribution: SessionSlice[];
  /** Bullish/Bearish % per weekday */
  dayOfWeek: DayOfWeekBar[];
}

// ── Legacy / connection ───────────────────────────────────────────────────────
export interface ConnectionStatus {
  connected: boolean;
  server: string;
  account?: string;
}
