import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import type { VolatilityDataPoint } from "@/types/analytics";
import { useLanguage } from "@/hooks/useLanguage";

interface VolatilityChartProps {
  data: VolatilityDataPoint[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  const { t } = useLanguage();
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-foreground">
        {payload[0].value}
        <span className="text-xs text-muted-foreground ml-1 font-normal">{t("pips")}</span>
      </p>
    </div>
  );
};

const getBarColor = (pips: number) => {
  if (pips >= 70) return "hsl(38,60%,50%)";
  if (pips >= 50) return "hsl(152,48%,42%)";
  return "hsl(215,55%,55%)";
};

const VolatilityChart = ({ data }: VolatilityChartProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col h-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            {t("chart_volatility_title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("chart_volatility_subtitle")}
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "hsl(215,55%,55%)" }} />
            {t("legend_low")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "hsl(152,48%,42%)" }} />
            {t("legend_mid")}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: "hsl(38,60%,50%)" }} />
            {t("legend_high")}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -18, bottom: 0 }}
            barCategoryGap="28%"
          >
            <XAxis
              dataKey="day"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}p`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "hsl(var(--surface-hover))" }}
            />
            <Bar dataKey="pips" radius={[3, 3, 0, 0]} maxBarSize={28}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.pips)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default VolatilityChart;
