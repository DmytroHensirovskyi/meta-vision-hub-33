import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { SessionDistribution } from "@/types/analytics";
import { useLanguage } from "@/hooks/useLanguage";

interface HODLODChartProps {
  data: SessionDistribution[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: SessionDistribution;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{item.name}</p>
      <p className="text-sm font-semibold text-foreground">{item.value}%</p>
    </div>
  );
};

const renderCustomLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.08) return null;
  return (
    <text
      x={x} y={y}
      fill="hsl(var(--foreground))"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-medium"
      fontSize={11}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const HODLODChart = ({ data }: HODLODChartProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-border rounded-lg p-5 flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-foreground">{t("chart_hodlod_title")}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {t("chart_hodlod_subtitle")}
        </p>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              innerRadius="45%"
              outerRadius="72%"
              dataKey="value"
              nameKey="session"
              strokeWidth={0}
              labelLine={false}
              label={renderCustomLabel}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={6}
              formatter={(value) => (
                <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HODLODChart;
