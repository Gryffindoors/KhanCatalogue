import { createContext, useContext, useEffect, useMemo, useState } from "react";
import translations from "../data/translations.json";

const UIContext = createContext(null);

const DEFAULT_LANGUAGE = "ar";
const STORAGE_KEY = "catalogue_language";

export function UIProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY);

    if (savedLanguage === "ar" || savedLanguage === "en") {
      return savedLanguage;
    }

    return DEFAULT_LANGUAGE;
  });

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
    localStorage.setItem(STORAGE_KEY, language);
  }, [language, dir]);

  const setLanguage = (nextLanguage) => {
    if (nextLanguage !== "ar" && nextLanguage !== "en") return;
    setLanguageState(nextLanguage);
  };

  const toggleLanguage = () => {
    setLanguageState((current) => (current === "ar" ? "en" : "ar"));
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      dir,
      t: translations[language],
    }),
    [language, dir]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);

  if (!context) {
    throw new Error("useUI must be used inside UIProvider");
  }

  return context;
}