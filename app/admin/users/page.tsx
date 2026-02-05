"use client";

import { useEffect, useState } from "react";
import { Shield, User as UserIcon, Calendar, ShoppingBag, Key, Lock } from "lucide-react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const fetchUsers = () => {
        setLoading(true);
        fetch("/api/admin/users")
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch users", err);
                setLoading(false);
            });
    }

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        const selectableUsers = users.filter(u => u.email !== "admin@deal.lk");
        if (selectedIds.length === selectableUsers.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(selectableUsers.map(u => u.id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) return;

        try {
            const res = await fetch("/api/admin/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
            });

            if (res.ok) {
                alert("Users deleted successfully.");
                setSelectedIds([]);
                fetchUsers();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete users.");
            }
        } catch (error) {
            alert("An error occurred.");
        }
    };

    const handlePasswordReset = async (userId: string, email: string) => {
        const newPassword = prompt(`Enter a new password for ${email}:`);
        if (!newPassword) return;

        if (newPassword.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }

        try {
            const res = await fetch("/api/admin/users/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, newPassword }),
            });

            if (res.ok) {
                alert("Password reset successfully.");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to reset password.");
            }
        } catch (error) {
            alert("An error occurred while resetting the password.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-gray-400 mt-2">View and manage registered users</p>
                </div>
                {selectedIds.length > 0 && (
                    <button
                        onClick={handleBulkDelete}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-red-500/20"
                    >
                        Delete Selected ({selectedIds.length})
                    </button>
                )}
            </div>

            <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-gray-800">
                            <th className="px-6 py-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={users.length > 0 && selectedIds.length === users.filter(u => u.email !== "admin@deal.lk").length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-700 bg-transparent text-primary focus:ring-primary cursor-pointer"
                                />
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold">User</th>
                            <th className="px-6 py-4 text-sm font-semibold">Role</th>
                            <th className="px-6 py-4 text-sm font-semibold">Security (Hash)</th>
                            <th className="px-6 py-4 text-sm font-semibold">Joined</th>
                            <th className="px-6 py-4 text-sm font-semibold">Actions</th>
                            <th className="px-6 py-4 text-sm font-semibold text-right">Ads Posted</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-48" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-8 ml-auto" /></td>
                                </tr>
                            ))
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className={`hover:bg-white/5 transition-colors ${selectedIds.includes(user.id) ? "bg-white/5" : ""}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(user.id)}
                                            onChange={() => user.email !== "admin@deal.lk" && toggleSelect(user.id)}
                                            disabled={user.email === "admin@deal.lk"}
                                            className={`w-4 h-4 rounded border-gray-700 bg-transparent text-primary focus:ring-primary ${user.email === "admin@deal.lk" ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {user.name?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white flex items-center gap-1.5">
                                                    {user.name || "N/A"}
                                                    {user.email === "admin@deal.lk" && (
                                                        <span title="Protected Account">
                                                            <Lock size={12} className="text-yellow-500" />
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`flex justify-center items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold leading-none w-fit ${user.role === "ADMIN"
                                                ? "text-purple-400 bg-purple-400/10 border border-purple-400/20"
                                                : "text-gray-400 bg-gray-400/10 border border-gray-400/20"
                                                }`}>
                                                {user.role === "ADMIN" && <Shield size={12} />}
                                                {user.role}
                                            </span>
                                            {(() => {
                                                const lastActive = new Date(user.lastActive);
                                                const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
                                                const isOnline = lastActive > fiveMinutesAgo;
                                                return isOnline && (
                                                    <div className="relative flex h-2 w-2">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded block max-w-[150px] truncate" title={user.password}>
                                            {user.password}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handlePasswordReset(user.id, user.email)}
                                            className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg hover:bg-yellow-500/20 transition-colors"
                                            title="Reset Password"
                                        >
                                            <Key size={16} />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-primary font-bold">
                                            <ShoppingBag size={14} />
                                            {user._count.ads}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
