"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    User,
    Lock,
    Shield,
    ArrowRight,
    CheckCircle2,
    Settings as SettingsIcon
} from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function AdminSettingsPage() {
    const { data: session, update: updateSession } = useSession();

    // Profile States
    const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "" });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        if (session?.user) {
            setProfileForm({
                name: session.user.name || "",
                email: session.user.email || "",
                phone: (session.user as any).phone || "",
            });
        }
    }, [session]);

    const handleProfileUpdate = async () => {
        setIsSavingProfile(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: profileForm.name, phone: profileForm.phone }),
            });
            if (res.ok) {
                await updateSession({
                    name: profileForm.name,
                    phone: profileForm.phone
                });
                alert("Admin profile updated successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            alert("An error occurred.");
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        setIsUpdatingPassword(true);
        try {
            const res = await fetch("/api/user/password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                }),
            });
            if (res.ok) {
                setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                alert("Admin password updated successfully!");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to update password.");
            }
        } catch (error) {
            alert("An error occurred.");
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <SettingsIcon className="text-primary" />
                    System Settings
                </h1>
                <p className="text-gray-400 mt-2">Manage your administrative account and system preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Profile Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Account Information */}
                    <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <User className="text-primary" size={20} />
                                Admin Profile
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                                    <input
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all"
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                                    <input
                                        className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-gray-500 outline-none cursor-not-allowed"
                                        value={profileForm.email}
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Phone Number</label>
                                    <input
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all"
                                        value={profileForm.phone}
                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                        placeholder="077XXXXXXX"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handleProfileUpdate}
                                    disabled={isSavingProfile}
                                    className="bg-primary hover:bg-primary/90 text-white gap-2 px-8 h-12 rounded-xl"
                                >
                                    {isSavingProfile ? "Saving..." : "Save Profile"}
                                    <ArrowRight size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-800">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Lock className="text-primary" size={20} />
                                Security & Password
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50"
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full bg-black/50 border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-primary/50"
                                        value={passwordForm.confirmPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button
                                    onClick={handlePasswordUpdate}
                                    disabled={isUpdatingPassword}
                                    className="bg-primary hover:bg-primary/90 text-white gap-2 px-8 h-12 rounded-xl"
                                >
                                    {isUpdatingPassword ? "Updating..." : "Update Password"}
                                    <ArrowRight size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Status & Info */}
                <div className="space-y-6">
                    <div className="bg-surface rounded-2xl border border-gray-800 p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Account Status</h3>
                        <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-green-500">
                            <Shield size={20} />
                            <div>
                                <p className="font-bold text-sm">Super Admin</p>
                                <p className="text-xs opacity-80">Full administrative access</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl border border-gray-800 p-6">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Site Information</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Platform</span>
                                <span className="font-bold">Deal.lk</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Version</span>
                                <span className="font-bold text-primary">v1.2.0</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Last Synced</span>
                                <span className="font-bold">Just now</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-2xl border border-white/10 p-6">
                        <h3 className="font-bold text-white mb-2">Need Help?</h3>
                        <p className="text-sm text-gray-400 mb-4">Contact technical support for deep system changes or database resets.</p>
                        <Button className="w-full bg-white text-black hover:bg-gray-200 rounded-xl h-10 font-bold text-xs uppercase tracking-widest">
                            Support Docs
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
