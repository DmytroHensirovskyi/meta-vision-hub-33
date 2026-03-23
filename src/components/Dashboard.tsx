import { useState, useEffect } from "react";
import { Target, Maximize, Activity } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import KPICard from "@/components/KPICard";
import HODLODChart from "@/components/HODLODChart";
import VolatilityChart from "@/components/VolatilityChart";
import { calculateHodLod, calculateMidnightOverlap, calculateNyExpansion } from "@/lib/metrics";
import { generateMockCandles } from "@/lib/mockCandles";
import type { SessionDistribution, VolatilityDataPoint } from "@/types/analytics";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

interface MetricsState {
  nyMidnightOverlapProb: number;
  avgNYExpansion: number;
  currentWinrate: number;
  sessionDistribution: SessionDistribution[];
  volatility: VolatilityDataPoint[];
}

const INITIAL_METRICS: MetricsState = {
  nyMidnightOverlapProb: 0,
  avgNYExpansion: 0,
  currentWinrate: 0,
  sessionDistribution: [],
  volatility: [],
};

const todayLabel = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Dashboard = ({ token, onLogout }: DashboardProps) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [metrics, setMetrics] = useState<MetricsState>(INITIAL_METRICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);

      // ── In production: swap generateMockCandles() with a real OANDA API call
      // using the `token`.  The metrics functions are API-agnostic — they only
      // need an array of Candle objects.
      const candles = generateMockCandles(20);

      if (cancelled) return;

      // ── Run the three SMC metric calculations ────────────────────────────────
      const hodLod        = calculateHodLod(candles);
      const overlapProb   = calculateMidnightOverlap(candles);
      const nyExpansion   = calculateNyExpansion(candles);

      // ── Map metrics → UI state ──────────────────────────────────────────────
      setMetrics({
        nyMidnightOverlapProb: overlapProb,
        avgNYExpansion:        nyExpansion.average,
        // Winrate is not yet calculable from OHLC candles alone (needs trade history).
        // Placeholder: derive a pseudo-value from midnight-overlap probability.
        currentWinrate:        Math.round(overlapProb * 0.65),

        sessionDistribution: hodLod.map(s => ({
          session: s.session,
          value:   s.value,
          color:   s.color,
        })),

        volatility: nyExpansion.daily,
      });

      setLoading(false);
    })();

    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex animate-fade-in">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={onLogout}
      />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-56 flex flex-col min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background/90 backdrop-blur-sm">
          <div>
            <h1 className="text-base font-semibold text-foreground tracking-tight">
              SMC Analytics Engine
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{todayLabel()}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald inline-block" />
              Live
            </span>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 p-6 space-y-5">
          {activeView === "dashboard" && (
            <>
              {loading ? (
                <div className="flex items-center justify-center py-32">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 rounded-full border-2 border-border border-t-accent-blue animate-spin" />
                    <p className="text-xs text-muted-foreground">Calculating metrics…</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* ── KPI Cards ── */}
                  <section>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                      Key Metrics
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <KPICard
                        title="NY Midnight Overlap Prob."
                        value={`${metrics.nyMidnightOverlapProb}%`}
                        icon={Target}
                        subtitle="% of days with 50+ pip deviation before NY open"
                        accentColor="hsl(var(--accent-blue))"
                      />
                      <KPICard
                        title="Avg NY Expansion"
                        value={`${metrics.avgNYExpansion} pips`}
                        icon={Maximize}
                        subtitle="Average pip range during NY session (07:00–17:00)"
                        accentColor="hsl(var(--accent-emerald))"
                      />
                      <KPICard
                        title="Estimated Winrate"
                        value={`${metrics.currentWinrate}%`}
                        icon={Activity}
                        subtitle="Derived from overlap probability signal"
                        accentColor="hsl(var(--accent-amber))"
                      />
                    </div>
                  </section>

                  {/* ── Charts ── */}
                  <section>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                      Session Analysis
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Donut — 1/3 */}
                      <div className="lg:col-span-1" style={{ minHeight: 320 }}>
                        <HODLODChart data={metrics.sessionDistribution} />
                      </div>
                      {/* Bar — 2/3 */}
                      <div className="lg:col-span-2" style={{ minHeight: 320 }}>
                        <VolatilityChart data={metrics.volatility} />
                      </div>
                    </div>
                  </section>

                  {/* ── Footer note ── */}
                  <p className="text-xs text-muted-foreground/50 text-center pt-2">
                    Metrics computed from {`${generateMockCandles.length ? "mock" : ""}`} OHLC candles · All times in UTC
                  </p>
                </>
              )}
            </>
          )}

          {activeView === "trade-journal" && (
            <EmptyView title="Trade Journal" description="Your trade history and notes will appear here." />
          )}

          {activeView === "settings" && (
            <EmptyView title="Settings" description="Manage your OANDA / MetaApi connection and preferences." />
          )}
        </div>
      </main>
    </div>
  );
};

// Placeholder for other views
const EmptyView = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center animate-slide-up">
    <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
      <span className="text-lg">📂</span>
    </div>
    <h2 className="text-sm font-medium text-foreground">{title}</h2>
    <p className="text-xs text-muted-foreground mt-1">{description}</p>
  </div>
);

export default Dashboard;
