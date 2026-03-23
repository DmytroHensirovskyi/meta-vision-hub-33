import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  subtitle?: string;
  accentColor?: string; // CSS color value
  trend?: "up" | "down" | "neutral";
}

const KPICard = ({
  title,
  value,
  icon: Icon,
  subtitle,
  accentColor = "hsl(var(--accent-blue))",
}: KPICardProps) => {
  return (
    <div
      className="
        relative bg-surface border border-border rounded-lg p-5
        hover:bg-surface-hover transition-colors group
        overflow-hidden
      "
    >
      {/* Subtle corner accent */}
      <div
        className="absolute top-0 right-0 w-16 h-16 opacity-10 rounded-full blur-xl -translate-y-4 translate-x-4"
        style={{ backgroundColor: accentColor }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest truncate">
            {title}
          </p>
          <p
            className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
          >
            {value}
          </p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div
          className="flex items-center justify-center w-9 h-9 rounded-md border border-border shrink-0 mt-0.5"
          style={{ color: accentColor }}
        >
          <Icon className="w-4 h-4" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
