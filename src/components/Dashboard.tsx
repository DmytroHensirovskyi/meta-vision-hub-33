import { useState, useEffect } from "react";
import { Target, Maximize, Activity } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import KPICard from "@/components/KPICard";
import SessionDonutChart from "@/components/SessionDonutChart";
import DayOfWeekChart from "@/components/DayOfWeekChart";
import { computeAllMetrics } from "@/lib/metrics";
import { generateMockCandles } from "@/lib/mockCandles";
import { fetchCandles } from "@/lib/api";
import { useLanguage } from "@/hooks/useLanguage";
import type { SMCMetrics, CompressionState } from "@/types/analytics";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const EMPTY_METRICS: SMCMetrics = {
  asianSweepProb:   0,
  judasBiasProb:    0,
  compressionState: "Neutral",
  hodDistribution:  [],
  lodDistribution:  [],
  dayOfWeek:        [],
};

const todayLabel = (language: string) =>
  new Date().toLocaleDateString(
    language === "ru" ? "ru-RU" : language === "uk" ? "uk-UA" : "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

function compressionAccent(state: CompressionState): string {
  if (state === "Expected: Trend/Expansion")  return "hsl(var(--accent-emerald))";
  if (state === "Expected: Chop/Contraction") return "hsl(355,65%,52%)";
  return "hsl(var(--accent-amber))";
}

function compressionDisplay(state: CompressionState, t: (k: string) => string): string {
  if (state === "Expected: Trend/Expansion")  return t("compression_trend");
  if (state === "Expected: Chop/Contraction") return t("compression_chop");
  return t("compression_neutral");
}

const Dashboard = ({ token, onLogout }: DashboardProps) => {
  const { t, language } = useLanguage();
  const [activeView, setActiveView]   = useState("dashboard");
  const [metrics, setMetrics]         = useState<SMCMetrics>(EMPTY_METRICS);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);

      // Attempt real fetch; fall back to mock candles when token absent / fails
      let candles = await fetchCandles(token);
      if (candles.length === 0) candles = generateMockCandles(60); // 60 days of M15-like data

      if (cancelled) return;
      setMetrics(computeAllMetrics(candles));
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <div className="min-h-screen bg-background flex animate-fade-in">
      <Sidebar activeView={activeView} onNavigate={setActiveView} onLogout={onLogout} />

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
                  {/* ── Top Row: 3 KPI Cards ── */}
                  <section>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                      {t("section_metrics")}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <KPICard
                        title={t("kpi_asian_sweep_title")}
                        value={`${metrics.asianSweepProb}%`}
                        icon={Activity}
                        subtitle={t("kpi_asian_sweep_subtitle")}
                        accentColor="hsl(var(--accent-blue))"
                      />
                      <KPICard
                        title={t("kpi_judas_title")}
                        value={`${metrics.judasBiasProb}%`}
                        icon={Target}
                        subtitle={t("kpi_judas_subtitle")}
                        accentColor="hsl(var(--accent-amber))"
                      />
                      <KPICard
                        title={t("kpi_compression_title")}
                        value={compressionDisplay(metrics.compressionState, t)}
                        icon={Maximize}
                        subtitle={t("kpi_compression_subtitle")}
                        accentColor={compressionAccent(metrics.compressionState)}
                      />
                    </div>
                  </section>

                  {/* ── Middle Row: HOD + LOD Donuts ── */}
                  <section>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                      {t("section_session")}
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <SessionDonutChart
                        title={t("chart_hod_title")}
                        subtitle={t("chart_hod_subtitle")}
                        data={metrics.hodDistribution}
                      />
                      <SessionDonutChart
                        title={t("chart_lod_title")}
                        subtitle={t("chart_lod_subtitle")}
                        data={metrics.lodDistribution}
                      />
                    </div>
                  </section>

                  {/* ── Bottom Row: Day of Week Bar Chart ── */}
                  <section>
                    <div style={{ minHeight: 320 }}>
                      <DayOfWeekChart data={metrics.dayOfWeek} />
                    </div>
                  </section>

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
