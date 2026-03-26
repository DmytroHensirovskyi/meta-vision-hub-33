import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import type { SessionSlice } from "@/types/analytics";

interface Props {
  title: string;
  subtitle: string;
  data: SessionSlice[];
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: SessionSlice }>;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-surface border border-border rounded-md px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{item.name}</p>
      <p className="text-sm font-semibold text-foreground">{item.value}%</p>
    </div>
  );
};

const renderLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number; percent: number;
}) => {
  if (percent < 0.07) return null;
  const RADIAN = Math.PI / 180;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="hsl(var(--foreground))" textAnchor="middle"
      dominantBaseline="central" fontSize={11} fontWeight={500}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const SessionDonutChart = ({ title, subtitle, data }: Props) => (
  <div className="bg-surface border border-border rounded-lg p-5 flex flex-col h-full">
    <div className="mb-4">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
    </div>
    <div className="flex-1 min-h-0" style={{ minHeight: 220 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="45%"
            innerRadius="42%" outerRadius="68%"
            dataKey="value" nameKey="session"
            strokeWidth={0}
            labelLine={false}
            label={renderLabel}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle" iconSize={6}
            formatter={value => (
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

export default SessionDonutChart;
