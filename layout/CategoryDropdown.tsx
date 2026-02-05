"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Layout } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CategoryDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const { t } = useLanguage();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div
            className="relative"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className={`flex items-center gap-1 transition-colors py-2 text-sm font-medium ${isOpen ? 'text-primary' : 'text-gray-300 hover:text-primary'}`}
            >
                {t("nav.categories")}
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute top-full left-0 w-64 pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="bg-surface border border-gray-800 rounded-xl shadow-2xl overflow-hidden p-2 grid grid-cols-1 gap-1">
                        <Link
                            href="/ads"
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-primary transition-all group/item"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                                <Layout className="w-4 h-4" />
                            </div>
                            <span>{t("nav.allAds")}</span>
                        </Link>

                        <div className="my-1 border-t border-gray-800" />

                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/ads?category=${category.name.toLowerCase()}`}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5 hover:text-primary transition-all group/item"
                                onClick={() => setIsOpen(false)}
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center group-hover/item:bg-primary/20 transition-colors">
                                    <Layout className="w-4 h-4" />
                                </div>
                                <span className="capitalize">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
