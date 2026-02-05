"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/lib/translations";

const languages = [
    { code: "en", name: "English", label: "English" },
    { code: "si", name: "Sinhala", label: "සිංහල" },
    { code: "ta", name: "Tamil", label: "தமிழ்" },
];

export default function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
    };

    const otherLanguages = languages.filter((l) => l.code !== language);

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden h-10">
                {languages.map((lang, index) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code as Language)}
                        className={`px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all flex items-center h-full
                            ${language === lang.code
                                ? "bg-white/10 text-white shadow-inner"
                                : "text-gray-500 hover:text-white hover:bg-white/5"}
                            ${index !== languages.length - 1 ? "border-r border-white/5" : ""}
                        `}
                    >
                        {lang.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
