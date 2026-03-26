import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import type { DayOfWeekBar } from "@/types/analytics";
import { useLanguage } from "@/hooks/useLanguage";

interface Props {
  data: DayOfWeekBar[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-lg space-y-1">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      {payload.map(p => (
        <p key={p.name} className="text-xs" style={{ color: p.color }}>
          {p.name}: <span className="font-semibold">{p.value}%</span>
        </p>
      ))}
    </div>
  );
};

const DayOfWeekChart = ({ data }: Props) => {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col h-full">
      <div className="mb-5">
        <h3 className="text-sm font-medium text-foreground">{t("chart_dow_title")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{t("chart_dow_subtitle")}</p>
      </div>
      <div className="flex-1 min-h-0" style={{ minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="35%" barGap={3}>
            <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              axisLine={false} tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
            />
            <YAxis
              domain={[0, 100]} tickCount={5} unit="%"
              axisLine={false} tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--surface-hover))" }} />
            <Legend
              iconType="circle" iconSize={6}
              formatter={value => (
                <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }}>
                  {value}
                </span>
              )}
            />
            <Bar dataKey="bullish" name={t("dow_bullish")} fill="hsl(var(--accent-emerald))" radius={[3, 3, 0, 0]} />
            <Bar dataKey="bearish" name={t("dow_bearish")} fill="hsl(152, 48%, 42%)" radius={[3, 3, 0, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill="hsl(355,65%,52%)" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DayOfWeekChart;
