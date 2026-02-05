"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
    initialQuery?: string;
    category?: string;
    variant?: "default" | "hero";
}

export default function SearchBar({ initialQuery = "", category, variant = "default" }: SearchBarProps) {
    const [query, setQuery] = useState(initialQuery);
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const router = useRouter();

    // Sync state with prop updates
    useEffect(() => {
        setQuery(initialQuery);
    }, [initialQuery]);

    const fetchSuggestions = async (q: string) => {
        if (q.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await fetch(`/api/ads/suggestions?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Failed to fetch suggestions", error);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query) fetchSuggestions(query);
            else setSuggestions([]);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleSearch = (q?: string, type?: string) => {
        const finalQuery = q || query;
        if (!finalQuery.trim() && !category) return;

        const params = new URLSearchParams();

        if (type === "category") {
            params.set("category", finalQuery.toLowerCase());
        } else {
            if (finalQuery) params.set("q", finalQuery);
            if (category) params.set("category", category);
        }

        router.push(`/ads?${params.toString()}`);
        setShowSuggestions(false);
    };

    const clearSearch = () => {
        setQuery("");
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className={`relative w-full group mx-auto px-1 sm:px-0 ${variant === 'hero' ? 'max-w-xl' : 'max-w-2xl'}`}>
            <div className={`flex items-center gap-1 sm:gap-2 border transition-all duration-300 ${variant === 'hero'
                    ? 'bg-white p-1 sm:p-2 rounded-full shadow-lg border-transparent'
                    : `bg-white/5 backdrop-blur-xl p-1 sm:p-1.5 border-white/10 group-focus-within:border-[#00A3FF]/50 group-focus-within:bg-white/10 ${showSuggestions && suggestions.length > 0 ? 'rounded-t-[20px] sm:rounded-t-[28px]' : 'rounded-full hover:bg-white/10 shadow-2xl'}`
                }`}>
                <div className="pl-3 sm:pl-5 flex items-center text-gray-500 group-focus-within:text-[#00A3FF] transition-colors">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                        setSelectedIndex(-1);
                    }}
                    onFocus={() => {
                        if (query.length >= 2) {
                            setShowSuggestions(true);
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (selectedIndex >= 0) {
                                handleSearch(suggestions[selectedIndex].text, suggestions[selectedIndex].type);
                            } else {
                                handleSearch();
                            }
                        } else if (e.key === "ArrowDown") {
                            setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
                        } else if (e.key === "ArrowUp") {
                            setSelectedIndex(prev => Math.max(prev - 1, -1));
                        } else if (e.key === "Escape") {
                            setShowSuggestions(false);
                        }
                    }}
                    placeholder={variant === 'hero' ? "What are you looking for?" : "Search for anything..."}
                    className={`flex-1 bg-transparent border-none focus:ring-0 outline-none h-10 sm:h-12 placeholder-gray-500 text-base sm:text-lg ml-1 min-w-0 ${variant === 'hero' ? 'text-gray-900' : 'text-white'}`}
                />

                {query && (
                    <button
                        onClick={clearSearch}
                        className="p-2 text-gray-500 hover:text-white transition-colors"
                        type="button"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}

                <button
                    onClick={() => handleSearch()}
                    className={`${variant === 'hero' ? 'bg-[#ffc800] hover:bg-[#ffb300]' : 'bg-[#FF8A00] hover:bg-[#FF8A00]/90'} text-white w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all hover:scale-105 active:scale-95 flex-shrink-0 shadow-sm ml-1`}
                    type="button"
                >
                    <Search className={`w-4 h-4 sm:w-5 sm:h-5 ${variant === 'hero' ? 'text-gray-900' : 'text-white'}`} />
                </button>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-surface border-x border-b border-gray-800 rounded-b-2xl shadow-2xl overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-1">
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSearch(suggestion.text, suggestion.type)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${index === selectedIndex ? 'bg-white/10' : 'hover:bg-white/5'}`}
                        >
                            <Search className="w-4 h-4 text-gray-500" />
                            <div className="flex-1">
                                <span className="font-bold text-white mb-0.5 block line-clamp-1">
                                    {suggestion.text}
                                </span>
                                {suggestion.type === 'category' ? (
                                    <span className="text-xs text-secondary font-medium uppercase tracking-wider">in Categories</span>
                                ) : (
                                    <span className="text-xs text-gray-500">in {suggestion.category}</span>
                                )}
                            </div>
                        </button>
                    ))}
                    <button
                        onClick={() => handleSearch()}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left bg-white/5 hover:bg-white/10 border-t border-gray-800 transition-colors"
                    >
                        <Search className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">See all results for "{query}"</span>
                    </button>
                </div>
            )}

            {/* Click outside backdrop */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
}
