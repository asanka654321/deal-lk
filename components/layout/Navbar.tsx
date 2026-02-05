"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "../ui/Button";
import { Shield } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import CategoryDropdown from "./CategoryDropdown";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { Menu, MessageCircle, User as UserIcon } from "lucide-react";
import MobileSidebar from "./MobileSidebar";

export default function Navbar() {
    const { data: session } = useSession();
    const { t } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <>
            <nav className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/60 backdrop-blur-xl transition-all">
                <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-4 relative">
                    {/* Left: Hamburger (Mobile Only) */}
                    <div className="flex lg:hidden items-center">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsSidebarOpen(true);
                            }}
                            className="flex items-center gap-2 p-3 -ml-3 text-white hover:bg-white/10 rounded-full transition-colors active:scale-90 touch-manipulation relative z-[60]"
                            aria-label="Open menu"
                        >
                            <Menu className="w-8 h-8" />
                        </button>
                    </div>

                    {/* Logo - Centered on mobile, Left on desktop */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 sm:gap-3 group absolute left-1/2 -translate-x-1/2 lg:static lg:left-0 lg:translate-x-0"
                    >
                        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-[#00A3FF] text-white font-black text-xl sm:text-2xl shadow-[0_0_20px_rgba(0,163,255,0.4)] group-hover:scale-105 transition-transform">
                            D
                        </div>
                        <span className="text-xl sm:text-2xl font-black tracking-tighter text-white">Deal.lk</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-gray-400">
                        <Link href="/" className="hover:text-white transition-colors">
                            {t("nav.home")}
                        </Link>
                        <Link href="/ads" className="hover:text-white transition-colors">
                            {t("nav.allAds")}
                        </Link>
                        <div className="flex items-center gap-1 group cursor-pointer hover:text-white transition-colors">
                            <CategoryDropdown />
                        </div>
                        <Link href="/ads" className="hover:text-white transition-colors">
                            {t("nav.stores")}
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 sm:gap-6">
                        {/* Icons for Mobile (Message & Profile) */}
                        <div className="flex lg:hidden items-center gap-1">
                            <Link href="/messages" className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                                <MessageCircle className="w-6 h-6" />
                            </Link>
                            <Link href={session ? "/dashboard" : "/login"} className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                                <UserIcon className="w-6 h-6" />
                            </Link>
                        </div>

                        <div className="hidden xl:block">
                            <LanguageSwitcher />
                        </div>

                        {!session ? (
                            <Link href="/login" className="hidden lg:block text-sm font-bold uppercase tracking-widest text-white hover:text-[#3B82F6] transition-colors">
                                {t("nav.login")}
                            </Link>
                        ) : (
                            <div className="hidden lg:flex items-center gap-3 sm:gap-4">
                                <Link
                                    href={session.user?.role === "ADMIN" ? "/admin" : "/dashboard"}
                                    className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#3B82F6] transition-colors"
                                >
                                    {session.user?.role === "ADMIN" && (
                                        <Shield className="w-4 h-4 text-[#FF8A00] fill-[#FF8A00]" />
                                    )}
                                    <span className="hidden md:inline">{session.user?.name}</span>
                                </Link>
                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                    className="text-xs sm:text-sm font-medium text-red-500 hover:text-red-400 transition-colors whitespace-nowrap"
                                >
                                    Log out
                                </button>
                            </div>
                        )}

                        <Button variant="default" className="hidden lg:flex bg-[#FF8A00] hover:bg-[#FF8A00]/90 text-white rounded-full px-4 sm:px-8 h-8 sm:h-10 font-bold shadow-[0_0_20px_rgba(255,138,0,0.3)] hover:scale-105 transition-all text-[10px] sm:text-sm uppercase tracking-wide" asChild>
                            <Link href="/post-ad">
                                {t("nav.postAd")}
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar - Moved outside the nav element to avoid clipping/stacking issues with backdrop-blur */}
            <MobileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
}
