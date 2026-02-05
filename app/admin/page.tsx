"use client";

import { useEffect, useState } from "react";
import { ShoppingBag, Users, Clock, Star } from "lucide-react";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then((res) => res.json())
            .then((data) => {
                setStats(data.stats);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch stats", err);
                setLoading(false);
            });
    }, []);

    const cards = [
        {
            name: "Total Ads",
            value: stats?.totalAds || 0,
            icon: ShoppingBag,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            name: "Pending Approval",
            value: stats?.pendingAds || 0,
            icon: Clock,
            color: "text-yellow-500",
            bg: "bg-yellow-500/10"
        },
        {
            name: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            name: "Featured Ads",
            value: stats?.featuredAds || 0,
            icon: Star,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-400 mt-2">Overview of your marketplace</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.name}
                        className="bg-surface p-6 rounded-2xl border border-gray-800 flex items-center justify-between"
                    >
                        <div>
                            <p className="text-sm font-medium text-gray-400">{card.name}</p>
                            <p className="text-2xl font-bold mt-1">
                                {loading ? "..." : card.value}
                            </p>
                        </div>
                        <div className={`p-3 rounded-xl ${card.bg}`}>
                            <card.icon className={card.color} size={24} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder for Recent Activity */}
            <div className="bg-surface rounded-2xl border border-gray-800 p-8 text-center">
                <h2 className="text-xl font-semibold mb-2">System Status</h2>
                <div className="flex items-center justify-center gap-2 text-green-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>All services are operational</span>
                </div>
            </div>
        </div>
    );
}
