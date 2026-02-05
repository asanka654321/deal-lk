"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, User, Shield, HelpCircle, Info, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useSession, signOut } from "next-auth/react";
import LanguageSwitcher from "./LanguageSwitcher";
import { LogOut, LayoutDashboard } from "lucide-react";

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const { t } = useLanguage();
    const { data: session } = useSession();

    const menuItems = [
        { icon: Tag, label: "All ads in Deal.lk", href: "/ads" },
        ...(session
            ? [{ icon: LayoutDashboard, label: "My Dashboard", href: "/dashboard" }]
            : [{ icon: User, label: "Login", href: "/login" }]
        ),
        { icon: Shield, label: "Stay safe", href: "/safety" },
        { icon: HelpCircle, label: "FAQ", href: "/faq" },
        { icon: Info, label: "How to sell fast?", href: "/selling-tips" },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
                    />

                    {/* Sidebar container */}
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 h-screen w-[85%] max-w-[320px] z-[9999] bg-[#1a2122] text-white lg:hidden flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                                <div className="w-8 h-8 rounded-lg bg-[#00A3FF] flex items-center justify-center font-black">D</div>
                                <span className="text-xl font-black">Deal.lk</span>
                            </Link>
                            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Menu Items Area - Ensure it grows */}
                        <div className="flex-1 overflow-y-auto px-2 py-6">
                            <div className="flex flex-col gap-1">
                                {menuItems.map((item, idx) => (
                                    <Link
                                        key={idx}
                                        href={item.href}
                                        onClick={onClose}
                                        className="flex items-center gap-4 px-4 py-4 hover:bg-white/10 active:bg-white/10 rounded-xl transition-all group border-b border-white/5 last:border-0"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00A3FF]/20 group-hover:text-[#00A3FF] transition-all">
                                            <item.icon className="w-5 h-5 text-gray-300 group-hover:text-[#00A3FF]" />
                                        </div>
                                        <span className="text-base font-semibold text-gray-100">{item.label}</span>
                                    </Link>
                                ))}

                                {session && (
                                    <button
                                        onClick={() => {
                                            signOut({ callbackUrl: "/" });
                                            onClose();
                                        }}
                                        className="flex items-center gap-4 px-4 py-4 hover:bg-red-500/10 active:bg-red-500/20 rounded-xl transition-all group w-full text-left"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/20 group-hover:text-red-500 transition-all">
                                            <LogOut className="w-5 h-5 text-red-500/70 group-hover:text-red-500" />
                                        </div>
                                        <span className="text-base font-semibold text-red-500/90 group-hover:text-red-500">Log out</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Footer / Language Switcher */}
                        <div className="p-6 border-t border-white/10 bg-black/20">
                            <div className="flex justify-center">
                                <div className="inline-flex rounded-full border border-white/20 p-1">
                                    <button className="px-4 py-1 rounded-full text-xs font-bold bg-white/10">සිංහල</button>
                                    <button className="px-4 py-1 rounded-full text-xs font-bold text-gray-500">தமிழ்</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
