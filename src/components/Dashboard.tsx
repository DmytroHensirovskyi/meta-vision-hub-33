import { useState, useEffect } from "react";
import { Target, Maximize, Activity } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import KPICard from "@/components/KPICard";
import HODLODChart from "@/components/HODLODChart";
import VolatilityChart from "@/components/VolatilityChart";
import { fetchMetaApiData } from "@/lib/api";
import type { AnalyticsData } from "@/types/analytics";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const todayLabel = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Dashboard = ({ token, onLogout }: DashboardProps) => {
  const [activeView, setActiveView] = useState("dashboard");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const result = await fetchMetaApiData(token);
      if (!cancelled) {
        setData(result);
        setLoading(false);
      }
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
                    <p className="text-xs text-muted-foreground">Loading data…</p>
                  </div>
                </div>
              ) : data ? (
                <>
                  {/* ── KPI Cards ── */}
                  <section>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">
                      Key Metrics
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <KPICard
                        title="NY Midnight Overlap Prob."
                        value={`${data.kpi.nyMidnightOverlapProb}%`}
                        icon={Target}
                        subtitle="Based on last 30 sessions"
                        accentColor="hsl(var(--accent-blue))"
                      />
                      <KPICard
                        title="Avg NY Expansion"
                        value={`${data.kpi.avgNYExpansion} pips`}
                        icon={Maximize}
                        subtitle="Average pip expansion at open"
                        accentColor="hsl(var(--accent-emerald))"
                      />
                      <KPICard
                        title="Current Winrate"
                        value={`${data.kpi.currentWinrate}%`}
                        icon={Activity}
                        subtitle="Last 50 executed trades"
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
                        <HODLODChart data={data.sessionDistribution} />
                      </div>
                      {/* Bar — 2/3 */}
                      <div className="lg:col-span-2" style={{ minHeight: 320 }}>
                        <VolatilityChart data={data.volatility} />
                      </div>
                    </div>
                  </section>

                  {/* ── Footer note ── */}
                  <p className="text-xs text-muted-foreground/50 text-center pt-2">
                    Data refreshes every session open · All times in UTC
                  </p>
                </>
              ) : null}
            </>
          )}

          {activeView === "trade-journal" && (
            <EmptyView title="Trade Journal" description="Your trade history and notes will appear here." />
          )}

          {activeView === "settings" && (
            <EmptyView title="Settings" description="Manage your MetaApi connection and preferences." />
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
