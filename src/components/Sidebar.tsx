import { LayoutDashboard, BookOpen, Settings, LogOut, Zap, Radio } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSwitcher from "@/components/LanguageSwitcher";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

const Sidebar = ({ activeView, onNavigate, onLogout }: SidebarProps) => {
  const { t } = useLanguage();

  const navItems = [
    { id: "dashboard",     label: t("nav_dashboard"),  icon: LayoutDashboard },
    { id: "trade-journal", label: t("nav_journal"),    icon: BookOpen },
    { id: "settings",      label: t("nav_settings"),   icon: Settings },
  ];

  return (
    <aside className="
      fixed left-0 top-0 h-full w-56
      bg-sidebar border-r border-sidebar-border
      flex flex-col z-20 shrink-0
    ">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-7 h-7 rounded bg-surface border border-border">
          <Zap className="w-3.5 h-3.5 text-accent-blue" strokeWidth={1.5} />
        </div>
        <span className="text-sm font-semibold text-foreground tracking-tight">
          Analytica
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`
                w-full flex items-center gap-2.5 px-3 py-2 rounded-md
                text-sm transition-colors text-left
                ${isActive
                  ? "bg-surface-hover text-foreground"
                  : "text-sidebar-foreground hover:bg-surface-hover hover:text-foreground"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${isActive ? "text-accent-blue" : ""}`}
                strokeWidth={1.5}
              />
              <span className={isActive ? "font-medium" : ""}>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Language Switcher */}
      <div className="px-4 py-3 border-t border-sidebar-border">
        <LanguageSwitcher />
      </div>

      {/* Active Connection */}
      <div className="px-4 py-3 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-widest font-medium">
          {t("sidebar_connection")}
        </p>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-emerald opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-emerald" />
          </span>
          <span className="text-xs text-foreground flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-muted-foreground" strokeWidth={1.5} />
            {t("sidebar_server")}
          </span>
        </div>
      </div>

      {/* Logout */}
      <div className="px-2 pb-4">
        <button
          onClick={onLogout}
          className="
            w-full flex items-center gap-2.5 px-3 py-2 rounded-md
            text-sm text-muted-foreground
            hover:bg-surface-hover hover:text-foreground
            transition-colors
          "
        >
          <LogOut className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          {t("sidebar_logout")}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
