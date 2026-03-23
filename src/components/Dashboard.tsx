import { useState, useEffect } from "react";
import { Target, Maximize, Activity } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import KPICard from "@/components/KPICard";
import HODLODChart from "@/components/HODLODChart";
import VolatilityChart from "@/components/VolatilityChart";
import { calculateHodLod, calculateMidnightOverlap, calculateNyExpansion } from "@/lib/metrics";
import { generateMockCandles } from "@/lib/mockCandles";
import { useLanguage } from "@/hooks/useLanguage";
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

const todayLabel = (language: string) =>
  new Date().toLocaleDateString(
    language === "ru" ? "ru-RU" : language === "uk" ? "uk-UA" : "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

const Dashboard = ({ token, onLogout }: DashboardProps) => {
  const { t, language } = useLanguage();
  const [activeView, setActiveView] = useState("dashboard");
  const [metrics, setMetrics] = useState<MetricsState>(INITIAL_METRICS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      const candles = generateMockCandles(20);
      if (cancelled) return;

      const hodLod      = calculateHodLod(candles);
      const overlapProb = calculateMidnightOverlap(candles);
      const nyExpansion = calculateNyExpansion(candles);

      setMetrics({
        nyMidnightOverlapProb: overlapProb,
        avgNYExpansion:        nyExpansion.average,
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

  // Translate session names in distribution data
  const translatedDistribution = metrics.sessionDistribution.map(s => ({
    ...s,
    session:
      s.session === "Asia"   ? t("session_asia")   :
      s.session === "London" ? t("session_london") :
      s.session === "NY"     ? t("session_ny")     : s.session,
  }));

  return (
    <div className="min-h-screen bg-background flex animate-fade-in">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        onLogout={onLogout}
      />

      <main className="flex-1 ml-56 flex flex-col min-h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-background/90 backdrop-blur-sm">
          <div>
            <h1 className="text-base font-semibold text-foreground tracking-tight">
              {t("header_title")}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">{todayLabel(language)}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-md px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-emerald inline-block" />
              {t("header_live")}
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
                    <p className="text-xs text-muted-foreground">{t("loading")}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* KPI Cards */}
                  <section>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                      {t("section_metrics")}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <KPICard
                        title={t("kpi_overlap_title")}
                        value={`${metrics.nyMidnightOverlapProb}%`}
                        icon={Target}
                        subtitle={t("kpi_overlap_subtitle")}
                        accentColor="hsl(var(--accent-blue))"
                      />
                      <KPICard
                        title={t("kpi_expansion_title")}
                        value={`${metrics.avgNYExpansion} ${t("pips")}`}
                        icon={Maximize}
                        subtitle={t("kpi_expansion_subtitle")}
                        accentColor="hsl(var(--accent-emerald))"
                      />
                      <KPICard
                        title={t("kpi_winrate_title")}
                        value={`${metrics.currentWinrate}%`}
                        icon={Activity}
                        subtitle={t("kpi_winrate_subtitle")}
                        accentColor="hsl(var(--accent-amber))"
                      />
                    </div>
                  </section>

                  {/* Charts */}
                  <section>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                      {t("section_session")}
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-1" style={{ minHeight: 320 }}>
                        <HODLODChart data={translatedDistribution} />
                      </div>
                      <div className="lg:col-span-2" style={{ minHeight: 320 }}>
                        <VolatilityChart data={metrics.volatility} />
                      </div>
                    </div>
                  </section>

                  {/* Footer note */}
                  <p className="text-xs text-muted-foreground/50 text-center pt-2">
                    {t("footer_note")}
                  </p>
                </>
              )}
            </>
          )}

          {activeView === "trade-journal" && (
            <EmptyView title={t("journal_title")} description={t("journal_desc")} />
          )}

          {activeView === "settings" && (
            <EmptyView title={t("settings_title")} description={t("settings_desc")} />
          )}
        </div>
      </main>
    </div>
  );
};

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
