"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import SearchBar from "../ad/SearchBar";
import CircuitBoard from "./CircuitBoard";
import { MapPin } from "lucide-react";

const categories = [
    { name: "Vehicles", delay: 0, top: "12%", left: "38%" },
    { name: "Jobs", delay: 0.5, top: "55%", left: "18%" },
    { name: "Fashion", delay: 1.5, top: "50%", left: "75%" },
    { name: "Property", delay: 2, top: "72%", left: "48%" },
    { name: "Electronics", delay: 1, top: "85%", left: "65%" },
];

export default function Hero() {
    const { t } = useLanguage();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <section className="relative min-h-[60vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-[#00705b] lg:bg-black py-16 lg:py-40">
            {/* Background Circuit Pattern - Only on Desktop */}
            <div className="hidden lg:block">
                <CircuitBoard />
            </div>

            <div className="container px-4 mx-auto relative z-10">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl font-black tracking-tighter text-white sm:text-8xl mb-8 leading-[0.9]"
                    >
                        {t("hero.title").split(/(\{anything\}|\{sriLanka\})/g).map((part: string, i: number) => {
                            if (part === "{anything}") return <span key={i} className="text-[#00A3FF]">{t("hero.anything")}</span>;
                            if (part === "{sriLanka}") return <span key={i} className="text-[#FF8A00]">{t("hero.sriLanka")}</span>;
                            return part;
                        })}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto"
                    >
                        Experience the most premium marketplace for all your needs.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="max-w-2xl mx-auto relative z-20 space-y-4"
                    >
                        {/* Mobile Location Picker Pill */}
                        <div className="flex lg:hidden justify-center">
                            <button className="flex items-center gap-2 px-4 py-2 bg-black/20 backdrop-blur-md rounded-full text-white/90 text-sm font-medium border border-white/10">
                                <MapPin className="w-4 h-4" />
                                All of Sri Lanka
                            </button>
                        </div>

                        <SearchBar variant="hero" />
                    </motion.div>
                </div>
            </div>

            {/* Premium Floating Elements - Desktop Only */}
            <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.name}
                        className="absolute flex items-center justify-center px-8 py-5 rounded-2xl shadow-[0_0_30px_rgba(20,184,166,0.15)] backdrop-blur-2xl bg-[#0a0a0f]/60 border border-white/20 text-sm font-bold text-white tracking-widest uppercase group cursor-default"
                        style={{
                            top: cat.top,
                            left: cat.left,
                        }}
                        animate={{
                            y: [0, -10, 0],
                            boxShadow: [
                                "0 0 15px rgba(20,184,166,0.1)",
                                "0 0 25px rgba(20,184,166,0.3)",
                                "0 0 15px rgba(20,184,166,0.1)"
                            ]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: cat.delay,
                        }}
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-30" />
                        <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#14B8A6]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="relative z-10">{cat.name}</span>
                    </motion.div>
                ))}
            </div>

            {/* Background Gradient Glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
        </section>
    );
}
