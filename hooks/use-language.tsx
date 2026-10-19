"use client";

import React, { createContext, useContext, useState } from "react";
import { translations } from "@/lib/translations";

type TranslationType = typeof translations.es;

interface LanguageContextType {
  lang: "es" | "en";
  toggleLang: () => void;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<"es" | "en">("es");

  const toggleLang = () => setLang((prev) => (prev === "es" ? "en" : "es"));

  const t = translations[lang];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
