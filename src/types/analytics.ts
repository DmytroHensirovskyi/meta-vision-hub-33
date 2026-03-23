export interface KPIData {
  nyMidnightOverlapProb: number;  // percentage
  avgNYExpansion: number;          // pips
  currentWinrate: number;          // percentage
}

export interface SessionDistribution {
  session: string;
  value: number;
  color: string;
}

export interface VolatilityDataPoint {
  day: string;
  pips: number;
}

export interface AnalyticsData {
  kpi: KPIData;
  sessionDistribution: SessionDistribution[];
  volatility: VolatilityDataPoint[];
}

export interface ConnectionStatus {
  connected: boolean;
  server: string;
  account?: string;
}
