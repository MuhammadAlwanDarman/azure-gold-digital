import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "ID" | "EN";

interface LanguageContextType {
 lang: Language;
 setLang: (lang: Language) => void;
 toggleLang: () => void;
 t: (idText: string, enText: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "pkbm_lang";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
 const [lang, setLangState] = useState<Language>("ID");

 useEffect(() => {
 const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
 if (saved === "ID" || saved === "EN") {
 setLangState(saved);
 }
 }, []);

 const setLang = (newLang: Language) => {
 setLangState(newLang);
 localStorage.setItem(STORAGE_KEY, newLang);
 };

 const toggleLang = () => {
 const nextLang = lang === "ID" ? "EN" : "ID";
 setLang(nextLang);
 };

 const t = (idText: string, enText: string) => {
 return lang === "EN" ? enText : idText;
 };

 return (
 <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
 {children}
 </LanguageContext.Provider>
 );
}

export function useLanguage() {
 const context = useContext(LanguageContext);
 if (!context) {
 throw new Error("useLanguage must be used within a LanguageProvider");
 }
 return context;
}
