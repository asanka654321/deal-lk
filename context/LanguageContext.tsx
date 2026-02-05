"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "@/lib/translations";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (path: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("en");

    useEffect(() => {
        const savedLang = localStorage.getItem("language") as Language;
        if (savedLang && ["en", "si", "ta"].includes(savedLang)) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("language", lang);
    };

    const t = (path: string) => {
        const keys = path.split(".");
        let result: any = translations[language];
        for (const key of keys) {
            if (result[key] === undefined) return path;
            result = result[key];
        }
        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
