import { createContext, useContext, useState, ReactNode } from "react";
import { Language, TranslationKey, translations } from "@/lib/i18n";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("analytica_lang") as Language) || "en";
  });

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem("analytica_lang", lang);
    setLanguage(lang);
  };

  const t = (key: TranslationKey): string => translations[language][key] ?? key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
