"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Home
} from "lucide-react";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const navigation = [
    { name: "Back to Website", href: "/", icon: Home },
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Manage Ads", href: "/admin/ads", icon: ShoppingBag },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside
                className={`${isSidebarOpen ? "w-64" : "w-20"
                    } transition-all duration-300 bg-surface border-r border-gray-800 flex flex-col fixed inset-y-0 z-50`}
            >
                <div className="p-6 flex items-center justify-between">
                    <Link href="/" className={`${!isSidebarOpen && "hidden"} block group`}>
                        <div className="font-bold text-xl text-primary">Deal.lk</div>
                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest group-hover:text-primary transition-colors">Super Admin</div>
                    </Link>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                                title={!isSidebarOpen ? item.name : ""}
                            >
                                <item.icon size={22} className={isActive ? "text-white" : "group-hover:text-white"} />
                                <span className={`${!isSidebarOpen && "hidden"} font-medium`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800 space-y-4">
                    {isSidebarOpen && session?.user && (
                        <div className="px-4 py-2">
                            <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        </div>
                    )}
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-500/10 transition-all duration-200"
                    >
                        <LogOut size={22} />
                        <span className={`${!isSidebarOpen && "hidden"} font-medium`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"} p-8`}>
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
