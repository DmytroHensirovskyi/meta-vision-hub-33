import { useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/lib/i18n";

const LANGS: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "uk", label: "UA", flag: "🇺🇦" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      {LANGS.map(({ code, label, flag }) => {
        const isActive = language === code;
        return (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            title={label}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors
              ${isActive
                ? "bg-surface-hover text-foreground border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-surface-hover border border-transparent"
              }
            `}
          >
            <span>{flag}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSwitcher;
