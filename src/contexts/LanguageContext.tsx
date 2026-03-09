import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { InterfaceLanguage, translations, getDirection } from "@/lib/i18n";

type Translations = typeof translations.ar | typeof translations.fr;

interface LanguageContextType {
  lang: InterfaceLanguage;
  setLang: (lang: InterfaceLanguage) => void;
  t: Translations;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "landpage-interface-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<InterfaceLanguage>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "ar" || stored === "fr") return stored;
    }
    return "fr"; // Default to French
  });

  const setLang = useCallback((newLang: InterfaceLanguage) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  }, []);

  const t = translations[lang];
  const dir = getDirection(lang);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
