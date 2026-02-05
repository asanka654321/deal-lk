"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    XCircle,
    LayoutDashboard,
    Home,
    Plus,
    Pencil,
    Trash2,
    X,
    Eye,
    User,
    UserCircle,
    Bell,
    ArrowRight,
    Lock,
    LogOut,
    Trash
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { cities } from "@/lib/cities";
import SearchableSelect from "@/components/ui/SearchableSelect";

type Tab = "PROFILE" | "ADVERTISEMENTS";

export default function UserDashboard() {
    const { data: session, update: updateSession } = useSession();
    const [activeTab, setActiveTab] = useState<Tab>("PROFILE");
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAd, setSelectedAd] = useState<any | null>(null);
    const [isEditingAd, setIsEditingAd] = useState(false);
    const [adUploading, setAdUploading] = useState(false);
    const [adEditForm, setAdEditForm] = useState({ title: "", price: "", description: "", images: "[]" });

    // Profile States
    const [profileForm, setProfileForm] = useState({ name: "", email: "", phone: "", city: "" });
    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    useEffect(() => {
        const fetchUserAds = async () => {
            try {
                const res = await fetch("/api/user/ads");
                const data = await res.json();
                setAds(data);
            } catch (error) {
                console.error("Failed to fetch ads", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchUserAds();
            setProfileForm({
                name: session.user.name || "",
                email: session.user.email || "",
                phone: (session.user as any).phone || "",
                city: (session.user as any).city || ""
            });
        }
    }, [session]);

    // Ad Edit Modal Sync
    useEffect(() => {
        if (selectedAd) {
            setAdEditForm({
                title: selectedAd.title,
                price: selectedAd.price.toString(),
                description: selectedAd.description,
                images: selectedAd.images || "[]"
            });
            setIsEditingAd(false);
        }
    }, [selectedAd]);

    const handleProfileUpdate = async () => {
        setIsSavingProfile(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: profileForm.name,
                    phone: profileForm.phone,
                    city: profileForm.city
                }),
            });
            if (res.ok) {
                await updateSession({
                    name: profileForm.name,
                    phone: profileForm.phone,
                    city: profileForm.city
                });
                alert("Profile updated successfully!");
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
                alert("Password updated successfully!");
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

    const handleAdSave = async () => {
        if (!selectedAd) return;
        try {
            const res = await fetch("/api/user/ads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedAd.id,
                    ...adEditForm,
                    price: parseFloat(adEditForm.price)
                }),
            });
            if (res.ok) {
                const updatedAd = await res.json();
                setAds(prevAds => prevAds.map(ad => ad.id === selectedAd.id ? { ...ad, ...updatedAd } : ad));
                setSelectedAd(null);
                setIsEditingAd(false);
                alert("Ad updated and sent for re-approval!");
            } else {
                alert("Failed to update ad.");
            }
        } catch (error) {
            alert("An error occurred.");
        }
    };

    const handleAdDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
        try {
            const res = await fetch(`/api/user/ads?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setAds(prevAds => prevAds.filter(ad => ad.id !== id));
                alert("Ad deleted successfully.");
            }
        } catch (error) {
            alert("An error occurred.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action is permanent and will delete all your advertisements.")) return;

        try {
            const res = await fetch("/api/user/profile", {
                method: "DELETE",
            });

            if (res.ok) {
                alert("Your account has been deleted successfully.");
                signOut({ callbackUrl: "/" });
            } else {
                alert("Failed to delete account.");
            }
        } catch (error) {
            alert("An error occurred while deleting your account.");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAdUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            const currentImages = JSON.parse(adEditForm.images);
            setAdEditForm(prev => ({ ...prev, images: JSON.stringify([...currentImages, data.url]) }));
        } catch (error) {
            alert("Upload failed.");
        } finally {
            setAdUploading(false);
        }
    };

    const removeImage = (index: number) => {
        const currentImages = JSON.parse(adEditForm.images);
        const updatedImages = currentImages.filter((_: any, i: number) => i !== index);
        setAdEditForm(prev => ({ ...prev, images: JSON.stringify(updatedImages) }));
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-green-500/10 text-green-500 border-green-500/20";
            case "REJECTED": return "bg-red-500/10 text-red-500 border-red-500/20";
            case "PENDING": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED": return <CheckCircle2 size={14} />;
            case "REJECTED": return <XCircle size={14} />;
            case "PENDING": return <Clock size={14} />;
            default: return null;
        }
    };

    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
                            {/* User Info Header */}
                            <div className="p-6 border-b border-white/5 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xl font-bold">
                                    {session?.user.name?.[0] || "U"}
                                </div>
                                <div className="overflow-hidden">
                                    <h3 className="font-bold truncate">{session?.user.name}</h3>
                                    <p className="text-xs text-gray-500 truncate">{session?.user.email}</p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="p-4 space-y-2">
                                <Link
                                    href="/"
                                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl transition-all font-bold uppercase tracking-[0.1em] text-sm bg-white/5 border border-white/10 hover:bg-primary/10 hover:border-primary/50 hover:text-primary mb-4 shadow-xl"
                                >
                                    <Home size={18} />
                                    BACK TO HOME
                                </Link>
                                <div className="h-px bg-white/5 mx-2 mb-4" /> {/* Divider */}
                                <button
                                    onClick={() => setActiveTab("PROFILE")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold uppercase tracking-wider text-xs ${activeTab === "PROFILE" ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20" : "text-gray-400 hover:bg-white/5"}`}
                                >
                                    <User size={18} />
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab("ADVERTISEMENTS")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold uppercase tracking-wider text-xs mt-1 ${activeTab === "ADVERTISEMENTS" ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/20" : "text-gray-400 hover:bg-white/5"}`}
                                >
                                    <ShoppingBag size={18} />
                                    Advertisements
                                </button>
                            </nav>
                        </div>

                        {/* Become a Partner Callout (Matching screenshot design) */}
                        <div className="mt-6 rounded-2xl overflow-hidden relative group cursor-pointer aspect-[4/3]">
                            <Image
                                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop"
                                alt="Partner"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 backdrop-blur-md flex items-center justify-center mb-3">
                                    <UserCircle className="text-green-500" />
                                </div>
                                <h4 className="text-xl font-bold mb-1">Become a Partner</h4>
                                <p className="text-sm text-gray-300">Unlock premium selling features and higher visibility.</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 space-y-6">

                        {activeTab === "PROFILE" && (
                            <div className="space-y-6">
                                {/* Top Banner/Welcome */}
                                <div className="bg-[#111] rounded-2xl border border-white/5 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="text-center md:text-left">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl font-bold mb-4 mx-auto md:mx-0">
                                            {session?.user.name?.[0] || "U"}
                                        </div>
                                        <h2 className="text-3xl font-bold">Welcome, {session?.user.name}!</h2>
                                        <p className="text-gray-400">{session?.user.email}</p>
                                        <p className="text-xs text-gray-600 mt-2">User ID: {session?.user.id.slice(0, 8)}</p>
                                    </div>
                                    <div className="space-y-3 w-full md:w-auto">
                                        <Button
                                            onClick={handleDeleteAccount}
                                            className="w-full bg-red-600 hover:bg-red-700 text-white gap-2 h-12 rounded-xl"
                                        >
                                            <Trash size={18} />
                                            DELETE ACCOUNT
                                        </Button>
                                    </div>
                                </div>

                                {/* Personal Info Section */}
                                <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="p-8 border-b border-white/5">
                                        <h3 className="text-xl font-bold mb-2">Personal Information</h3>
                                        <p className="text-sm text-gray-400">View and edit your account details easily to keep your information up to date.</p>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Name</label>
                                                <input
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all"
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                                                <input
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-500 outline-none"
                                                    value={profileForm.email}
                                                    disabled
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Phone</label>
                                                <div className="flex gap-2">
                                                    <div className="w-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-sm font-bold">+94</div>
                                                    <input
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary/50 outline-none transition-all"
                                                        value={profileForm.phone}
                                                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <SearchableSelect
                                                label="City"
                                                value={profileForm.city}
                                                onChange={(val) => setProfileForm({ ...profileForm, city: val })}
                                                options={cities}
                                                placeholder="Select your city"
                                                searchPlaceholder="Search cities..."
                                            />
                                        </div>
                                        <div className="flex justify-end pt-4">
                                            <button
                                                onClick={handleProfileUpdate}
                                                disabled={isSavingProfile}
                                                className="flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-all uppercase tracking-widest text-sm"
                                            >
                                                {isSavingProfile ? "Saving..." : "Save Changes"}
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="p-8 border-b border-white/5">
                                        <h3 className="text-xl font-bold mb-2">Password Management</h3>
                                        <p className="text-sm text-gray-400">Update your password to keep your account secure.</p>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Current Password</label>
                                            <input
                                                type="password"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                                                value={passwordForm.currentPassword}
                                                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                                                    value={passwordForm.newPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none"
                                                    value={passwordForm.confirmPassword}
                                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">Password must be at least 8 characters long. We recommend using a mix of letters, numbers, and symbols.</p>
                                        <div className="flex justify-end pt-4">
                                            <button
                                                onClick={handlePasswordUpdate}
                                                disabled={isUpdatingPassword}
                                                className="flex items-center gap-2 font-bold text-primary hover:text-primary/80 transition-all uppercase tracking-widest text-sm"
                                            >
                                                {isUpdatingPassword ? "Updating..." : "Update Password"}
                                                <ArrowRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "ADVERTISEMENTS" && (
                            <div className="space-y-6">
                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 flex items-center gap-5">
                                        <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                                            <ShoppingBag size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Ads</p>
                                            <p className="text-3xl font-extrabold mt-1">{ads.length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 flex items-center gap-5">
                                        <div className="p-4 bg-green-500/10 rounded-2xl text-green-500">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Approved</p>
                                            <p className="text-3xl font-extrabold mt-1">{ads.filter(a => a.status === "APPROVED").length}</p>
                                        </div>
                                    </div>
                                    <div className="bg-[#111] p-6 rounded-2xl border border-white/5 flex items-center gap-5">
                                        <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-500">
                                            <Clock size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Pending</p>
                                            <p className="text-3xl font-extrabold mt-1">{ads.filter(a => a.status === "PENDING").length}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ads Table Section */}
                                <div className="bg-[#111] rounded-2xl border border-white/5 overflow-hidden">
                                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <ShoppingBag className="text-primary" size={20} />
                                            <h2 className="text-xl font-bold">My Advertisements</h2>
                                        </div>
                                        <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest">
                                            <Link href="/post-ad" className="flex items-center gap-2">
                                                <Plus size={16} />
                                                POST NEW AD
                                            </Link>
                                        </Button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-white/2 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                                                <tr>
                                                    <th className="px-6 py-4">Item Details</th>
                                                    <th className="px-6 py-4 text-center">Status</th>
                                                    <th className="px-6 py-4 text-right">Price</th>
                                                    <th className="px-6 py-4 text-right">Settings</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/2">
                                                {loading ? (
                                                    Array(3).fill(0).map((_, i) => (
                                                        <tr key={i} className="animate-pulse">
                                                            <td className="px-6 py-6"><div className="h-4 bg-white/5 rounded w-48 mb-2" /><div className="h-3 bg-white/5 rounded w-24" /></td>
                                                            <td className="px-6 py-6"><div className="h-6 bg-white/5 rounded-full w-20 mx-auto" /></td>
                                                            <td className="px-6 py-6"><div className="h-4 bg-white/5 rounded w-20 ml-auto" /></td>
                                                            <td className="px-6 py-6"><div className="h-8 bg-white/5 rounded-lg w-20 ml-auto" /></td>
                                                        </tr>
                                                    ))
                                                ) : ads.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={4} className="px-6 py-20 text-center">
                                                            <div className="max-w-xs mx-auto text-gray-500">
                                                                <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                                                                <p className="font-bold text-white mb-1">No ads found</p>
                                                                <p className="text-sm">You haven't posted anything yet. Start selling today!</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    ads.map((ad) => (
                                                        <tr key={ad.id} className="hover:bg-white/2 transition-colors group">
                                                            <td className="px-6 py-6">
                                                                <div className="flex items-center gap-5">
                                                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/5 flex-shrink-0 group-hover:border-primary/50 transition-colors">
                                                                        {(() => {
                                                                            try {
                                                                                const images = JSON.parse(ad.images);
                                                                                const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
                                                                                if (firstImage && !firstImage.startsWith("blob:")) {
                                                                                    return <Image src={firstImage} alt="" fill className="object-cover" />;
                                                                                }
                                                                            } catch (e) { }
                                                                            return (
                                                                                <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-gray-600">
                                                                                    <div className="text-[20px]">🖼️</div>
                                                                                    <div className="text-[7px] font-bold uppercase tracking-tighter mt-1">NO PHOTO</div>
                                                                                </div>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                    <div>
                                                                        <p className="font-bold text-white group-hover:text-primary transition-colors mb-0.5">{ad.title}</p>
                                                                        <p className="text-xs text-gray-500">{ad.category.name} • {new Date(ad.createdAt).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-6 text-center">
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusStyles(ad.status)}`}>
                                                                    {getStatusIcon(ad.status)}
                                                                    {ad.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-6 text-right font-extrabold text-primary">
                                                                LKR {ad.price.toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-6 text-right">
                                                                <div className="flex items-center justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        onClick={() => setSelectedAd(ad)}
                                                                        className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                                                                        title="View"
                                                                    >
                                                                        <Eye size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => { setSelectedAd(ad); setIsEditingAd(true); }}
                                                                        className="p-2 bg-white/5 text-blue-400 rounded-lg hover:bg-blue-500/20 hover:text-blue-300 transition-colors"
                                                                        title="Edit"
                                                                    >
                                                                        <Pencil size={16} />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleAdDelete(ad.id, ad.title)}
                                                                        className="p-2 bg-white/5 text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors"
                                                                        title="Delete"
                                                                    >
                                                                        <Trash2 size={16} />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reusable Ad Modal (Existing Logic Refined) */}
                {selectedAd && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <div className="bg-[#111] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-white/5 overflow-hidden flex flex-col shadow-2xl">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                                <h2 className="text-xl font-extrabold tracking-tight">{isEditingAd ? "Modify Listing" : "Listing Details"}</h2>
                                <button onClick={() => { setSelectedAd(null); setIsEditingAd(false); }} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                    <X size={24} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Listing Photos</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {(() => {
                                                try {
                                                    const images = isEditingAd ? JSON.parse(adEditForm.images) : JSON.parse(selectedAd.images);
                                                    const validImages = Array.isArray(images) ? images.filter((img: string) => !img.startsWith("blob:")) : [];
                                                    return (
                                                        <>
                                                            {validImages.map((img: string, i: number) => (
                                                                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-white/5 group/img">
                                                                    <Image src={img} alt="" fill className="object-cover" />
                                                                    {isEditingAd && (
                                                                        <button onClick={() => removeImage(i)} className="absolute top-2 right-2 p-1.5 bg-red-600 rounded-lg text-white opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                                            <X size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {isEditingAd && validImages.length < 5 && (
                                                                <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-white/5 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                                                                    <Plus className={`w-8 h-8 ${adUploading ? 'animate-spin text-primary' : 'text-gray-600'}`} />
                                                                    <span className="text-[10px] text-gray-600 font-bold mt-2">{adUploading ? 'UPLOADING...' : 'ADD PHOTO'}</span>
                                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={adUploading} />
                                                                </label>
                                                            )}
                                                        </>
                                                    );
                                                } catch (e) { return null; }
                                            })()}
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">Core Attributes</h3>
                                            {isEditingAd ? (
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-gray-600 font-bold ml-1">Title</label>
                                                        <input className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white outline-none focus:border-primary/50" value={adEditForm.title} onChange={(e) => setAdEditForm({ ...adEditForm, title: e.target.value })} />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] text-gray-600 font-bold ml-1">Price (LKR)</label>
                                                        <input type="number" className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white outline-none focus:border-primary/50" value={adEditForm.price} onChange={(e) => setAdEditForm({ ...adEditForm, price: e.target.value })} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <h1 className="text-3xl font-extrabold mb-2 leading-tight">{selectedAd.title}</h1>
                                                    <div className="flex items-center gap-2">
                                                        <div className="px-3 py-1 bg-primary text-white text-[10px] font-extrabold rounded-lg tracking-widest uppercase">Price</div>
                                                        <p className="text-3xl text-primary font-black">LKR {selectedAd.price.toLocaleString()}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Listing Description</h3>
                                            {isEditingAd ? (
                                                <textarea className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-white h-48 resize-none outline-none focus:border-primary/50" value={adEditForm.description} onChange={(e) => setAdEditForm({ ...adEditForm, description: e.target.value })} />
                                            ) : (
                                                <div className="p-6 bg-white/2 rounded-2xl border border-white/5">
                                                    <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">{selectedAd.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t border-white/5 bg-white/2 flex gap-4">
                                {isEditingAd ? (
                                    <>
                                        <Button onClick={handleAdSave} className="flex-1 bg-primary text-white h-14 rounded-2xl font-black text-sm tracking-widest">SAVE UPDATES</Button>
                                        <Button onClick={() => setIsEditingAd(false)} className="flex-1 bg-white/5 hover:bg-white/10 h-14 rounded-2xl font-black text-sm tracking-widest">CANCEL</Button>
                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => setIsEditingAd(true)} className="flex-1 bg-primary text-white h-14 rounded-2xl font-black text-sm tracking-widest">EDIT LISTING</Button>
                                        <Button onClick={() => handleAdDelete(selectedAd.id, selectedAd.title)} className="flex-1 bg-red-600/10 hover:bg-red-600/20 text-red-600 h-14 rounded-2xl font-black text-sm tracking-widest">DELETE PERMANENTLY</Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
