"use client";

import { useEffect, useState } from "react";
import { Check, X, Eye, RefreshCw, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function AdminAdsPage() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAd, setSelectedAd] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [editForm, setEditForm] = useState({ title: "", price: "", description: "", images: "[]" });
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const fetchAds = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/ads");
        const data = await res.json();
        setAds(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchAds();
    }, []);

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === ads.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(ads.map(ad => ad.id));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} ads?`)) return;

        try {
            const res = await fetch("/api/admin/ads", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
            });

            if (res.ok) {
                alert("Ads deleted successfully.");
                setSelectedIds([]);
                fetchAds();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete ads.");
            }
        } catch (error) {
            alert("An error occurred.");
        }
    };

    useEffect(() => {
        if (selectedAd) {
            setEditForm({
                title: selectedAd.title,
                price: selectedAd.price.toString(),
                description: selectedAd.description,
                images: selectedAd.images || "[]"
            });
            setIsEditing(false);
        }
    }, [selectedAd]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch("/api/admin/ads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (res.ok) {
                setAds(prevAds => prevAds.map(ad => ad.id === id ? { ...ad, status: newStatus } : ad));
                alert(`Ad ${newStatus.toLowerCase()} successfully!`);
            } else {
                const data = await res.json();
                alert(data.message || "Failed to update ad status.");
            }
        } catch (error) {
            console.error("Failed to update status", error);
            alert("An error occurred. Please try again.");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();

            const currentImages = JSON.parse(editForm.images);
            const updatedImages = [...currentImages, data.url];
            setEditForm(prev => ({ ...prev, images: JSON.stringify(updatedImages) }));
        } catch (error) {
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        try {
            const currentImages = JSON.parse(editForm.images);
            const updatedImages = currentImages.filter((_: any, i: number) => i !== index);
            setEditForm(prev => ({ ...prev, images: JSON.stringify(updatedImages) }));
        } catch (e) {
            console.error("Failed to remove image", e);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedAd) return;

        try {
            const res = await fetch("/api/admin/ads", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedAd.id,
                    ...editForm,
                    price: parseFloat(editForm.price)
                }),
            });

            if (res.ok) {
                const updatedAd = await res.json();
                setAds(prevAds => prevAds.map(ad => ad.id === selectedAd.id ? { ...ad, ...updatedAd } : ad));
                setSelectedAd({ ...selectedAd, ...updatedAd });
                setIsEditing(false);
                alert("Ad updated successfully!");
            } else {
                const data = await res.json();
                alert(data.message || "Failed to update ad.");
            }
        } catch (error) {
            alert("An error occurred. Please try again.");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "text-green-500 bg-green-500/10";
            case "REJECTED": return "text-red-500 bg-red-500/10";
            case "PENDING": return "text-yellow-500 bg-yellow-500/10";
            default: return "text-gray-500 bg-gray-500/10";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold">Manage Ads</h1>
                    <p className="text-gray-400 mt-2">Approve or reject marketplace listings</p>
                </div>
                <div className="flex gap-2">
                    {selectedIds.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all shadow-lg shadow-red-500/20"
                        >
                            Delete Selected ({selectedIds.length})
                        </button>
                    )}
                    <Button onClick={fetchAds} className="bg-white/5 border border-gray-800 hover:bg-white/10">
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-gray-800">
                            <th className="px-6 py-4 w-10">
                                <input
                                    type="checkbox"
                                    checked={ads.length > 0 && selectedIds.length === ads.length}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-700 bg-transparent text-primary focus:ring-primary cursor-pointer"
                                />
                            </th>
                            <th className="px-6 py-4 text-sm font-semibold">Title</th>
                            <th className="px-6 py-4 text-sm font-semibold">User</th>
                            <th className="px-6 py-4 text-sm font-semibold">Status</th>
                            <th className="px-6 py-4 text-sm font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-48" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20" /></td>
                                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24 ml-auto" /></td>
                                </tr>
                            ))
                        ) : ads.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                    No ads found
                                </td>
                            </tr>
                        ) : (
                            ads.map((ad) => (
                                <tr key={ad.id} className={`hover:bg-white/5 transition-colors ${selectedIds.includes(ad.id) ? "bg-white/5" : ""}`}>
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(ad.id)}
                                            onChange={() => toggleSelect(ad.id)}
                                            className="w-4 h-4 rounded border-gray-700 bg-transparent text-primary focus:ring-primary cursor-pointer"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black border border-gray-800 flex-shrink-0">
                                                {(() => {
                                                    try {
                                                        const images = JSON.parse(ad.images);
                                                        const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;

                                                        // Only show images that aren't temporary blob objects
                                                        if (firstImage && !firstImage.startsWith("blob:")) {
                                                            return <Image src={firstImage} alt="" fill className="object-cover" />;
                                                        }
                                                    } catch (e) { }
                                                    return (
                                                        <div className="w-full h-full flex flex-col items-center justify-center bg-white/5 text-gray-600">
                                                            <div className="text-[18px]">🖼️</div>
                                                            <div className="text-[8px] font-bold uppercase tracking-tighter mt-1">No Image</div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <div>
                                                <p className="font-medium">{ad.title}</p>
                                                <p className="text-sm text-gray-400 capitalize">{ad.category.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <p>{ad.user.name}</p>
                                        <p className="text-gray-500">{ad.user.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${getStatusColor(ad.status)}`}>
                                            {ad.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {ad.status === "PENDING" && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(ad.id, "APPROVED")}
                                                    className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(ad.id, "REJECTED")}
                                                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                                                    title="Reject"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </>
                                        )}
                                        <button
                                            onClick={() => setSelectedAd(ad)}
                                            className="p-2 bg-white/5 text-gray-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Ad Details Modal */}
            {selectedAd && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-2xl border border-gray-800 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Ad Details</h2>
                            <button
                                onClick={() => {
                                    setSelectedAd(null);
                                    setIsEditing(false);
                                }}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Images */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Images</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(() => {
                                            try {
                                                const images = isEditing ? JSON.parse(editForm.images) : JSON.parse(selectedAd.images);
                                                const validImages = Array.isArray(images) ? images.filter((img: string) => !img.startsWith("blob:")) : [];

                                                return (
                                                    <>
                                                        {validImages.map((img: string, i: number) => (
                                                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-black border border-gray-800 group/img">
                                                                <Image src={img} alt="" fill className="object-cover" />
                                                                {isEditing && (
                                                                    <button
                                                                        onClick={() => removeImage(i)}
                                                                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover/img:opacity-100 transition-opacity"
                                                                    >
                                                                        <X size={12} />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {isEditing && validImages.length < 5 && (
                                                            <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-800 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all">
                                                                <Plus className={`w-6 h-6 ${uploading ? 'animate-spin text-primary' : 'text-gray-500'}`} />
                                                                <span className="text-[10px] text-gray-500 mt-1">{uploading ? '...' : 'Add'}</span>
                                                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                                            </label>
                                                        )}
                                                        {validImages.length === 0 && !isEditing && (
                                                            <div className="col-span-2 py-8 text-center bg-white/5 rounded-lg text-gray-500 text-xs italic">No images available</div>
                                                        )}
                                                    </>
                                                );
                                            } catch (e) {
                                                return <p className="text-gray-500 italic">Error loading images</p>;
                                            }
                                        })()}
                                    </div>
                                </div>

                                {/* Right: Info */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Basic Info</h3>
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    className="w-full bg-black border border-gray-800 rounded-lg p-2 text-white"
                                                    value={editForm.title}
                                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                    placeholder="Title"
                                                />
                                                <input
                                                    type="number"
                                                    className="w-full bg-black border border-gray-800 rounded-lg p-2 text-white"
                                                    value={editForm.price}
                                                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                                    placeholder="Price"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <h1 className="text-2xl font-bold mb-1">{selectedAd.title}</h1>
                                                <p className="text-2xl text-primary font-bold">LKR {selectedAd.price.toLocaleString()}</p>
                                            </>
                                        )}
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">Category: {selectedAd.category.name}</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400">Location: {selectedAd.location.city}, {selectedAd.location.district}</span>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</h3>
                                        {isEditing ? (
                                            <textarea
                                                className="w-full bg-black border border-gray-800 rounded-lg p-2 text-white h-40 resize-none"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                placeholder="Description"
                                            />
                                        ) : (
                                            <p className="text-gray-300 whitespace-pre-wrap">{selectedAd.description}</p>
                                        )}
                                    </div>

                                    <div className="p-4 bg-white/5 rounded-xl border border-gray-800">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">User Details</h3>
                                        <div className="space-y-2">
                                            <p className="flex justify-between text-sm">
                                                <span className="text-gray-500">Name:</span>
                                                <span className="font-medium">{selectedAd.user.name}</span>
                                            </p>
                                            <p className="flex justify-between text-sm">
                                                <span className="text-gray-500">Email:</span>
                                                <span className="font-medium">{selectedAd.user.email}</span>
                                            </p>
                                            <p className="flex justify-between text-sm">
                                                <span className="text-gray-500">Phone:</span>
                                                <span className="font-medium">{selectedAd.user.phone || "N/A"}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-800 bg-white/5 flex gap-4">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleSaveEdit}
                                        className="flex-1 bg-primary text-white"
                                    >
                                        Save Changes
                                    </Button>
                                    <Button
                                        onClick={() => setIsEditing(false)}
                                        className="flex-1 bg-white/10 hover:bg-white/20"
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                                    >
                                        Edit Ad
                                    </Button>
                                    {selectedAd.status === "PENDING" && (
                                        <>
                                            <Button
                                                onClick={() => {
                                                    handleStatusUpdate(selectedAd.id, "APPROVED");
                                                    setSelectedAd(null);
                                                }}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                                            >
                                                Approve Ad
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    handleStatusUpdate(selectedAd.id, "REJECTED");
                                                    setSelectedAd(null);
                                                }}
                                                className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                                            >
                                                Reject Ad
                                            </Button>
                                        </>
                                    )}
                                    <Button
                                        onClick={() => setSelectedAd(null)}
                                        className={`flex-1 ${selectedAd.status !== "PENDING" ? "" : ""} bg-white/10 hover:bg-white/20`}
                                    >
                                        Close
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    );
}
