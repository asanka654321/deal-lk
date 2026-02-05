"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[] | { label: string; value: string }[];
    placeholder?: string;
    label?: string;
    searchPlaceholder?: string;
    required?: boolean;
    className?: string;
    error?: string;
}

export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = "Select an option",
    label,
    searchPlaceholder = "Search...",
    required = false,
    className = "",
    error
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const normalizedOptions = useMemo(() => (options || []).map(opt =>
        typeof opt === "string" ? { label: opt, value: opt } : {
            label: String(opt?.label || ""),
            value: String(opt?.value || "")
        }
    ), [options]);

    const filteredOptions = useMemo(() => {
        const query = (search || "").toLowerCase().trim();
        if (!query) return normalizedOptions;
        return normalizedOptions.filter((opt) =>
            opt.label.toLowerCase().includes(query)
        );
    }, [normalizedOptions, search]);

    const selectedOption = useMemo(() =>
        normalizedOptions.find(opt => opt.value === value),
        [normalizedOptions, value]);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10);
        } else {
            setSearch("");
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`space-y-2 ${className}`} ref={containerRef}>
            {label && (
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between rounded-xl bg-black border ${isOpen ? "border-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]" : "border-gray-800"} px-4 py-3 text-sm text-white transition-all outline-none`}
                >
                    <span className={selectedOption ? "text-white font-medium" : "text-gray-500"}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <div className="flex items-center gap-2">
                        {value && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange("");
                                }}
                                className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                        )}
                        {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                    </div>
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute z-[100] mt-2 w-full rounded-2xl bg-[#111] border border-gray-800 shadow-2xl overflow-hidden"
                        >
                            <div className="p-2 border-b border-gray-800 bg-white/2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        className="w-full bg-black border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-primary focus:outline-none transition-colors"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && filteredOptions.length > 0) {
                                                onChange(filteredOptions[0].value);
                                                setIsOpen(false);
                                                setSearch("");
                                            }
                                            e.stopPropagation();
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((opt, index) => (
                                        <button
                                            key={`${opt.value}-${index}`}
                                            type="button"
                                            onClick={() => {
                                                onChange(opt.value);
                                                setIsOpen(false);
                                                setSearch("");
                                            }}
                                            className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/5 ${value === opt.value ? "text-primary bg-primary/5 font-bold" : "text-gray-300"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                                        No results found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}
