"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { content, type Content } from "@/lib/content";

interface LanguageContextType {
  lang: "es" | "en";
  toggleLang: () => void;
  t: Content;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<"es" | "en">("es");

  const toggleLang = () => setLang((prev) => (prev === "es" ? "en" : "es"));

  const t = content[lang];

  // Screen readers pick pronunciation from <html lang>.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

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
