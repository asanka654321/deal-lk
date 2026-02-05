"use client";

import { MapPin, Calendar, Tag, Shield, Phone, User, Info, AlertTriangle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import ImageGallery from "@/components/ad/ImageGallery";

interface AdPreviewProps {
    data: {
        title: string;
        category: string;
        price: string;
        location: string;
        description: string;
        images: string[];
        phone1?: string;
        phone2?: string;
        phone3?: string;
        showPhone1?: boolean;
        showPhone2?: boolean;
        showPhone3?: boolean;
        attributes?: string;
    };
    onBack: () => void;
    onSubmit: () => void;
    loading: boolean;
    userName: string;
    userPhone: string;
}

export default function AdPreview({ data, onBack, onSubmit, loading, userName, userPhone }: AdPreviewProps) {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Warning Banner */}
            <div className="bg-orange-500/10 border border-orange-500/50 p-4 rounded-xl flex items-center gap-3 text-orange-500">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                    This ad is not published yet. You're viewing a preview of how it will appear once approved.
                </p>
            </div>

            {/* Actions Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
                >
                    <ArrowLeft size={20} />
                    Go back to edit details
                </button>
                <Button
                    onClick={onSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20"
                >
                    {loading ? "Submitting..." : "SUBMIT FOR APPROVAL"}
                </Button>
            </div>

            {/* Preview Card */}
            <div className="bg-surface rounded-2xl border border-gray-800 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-8 p-6 lg:p-8">
                    {/* Left Column: Images and Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <ImageGallery images={data.images} />

                        <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                                <Info className="text-primary" size={20} />
                                Listing Details
                            </h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                                {data.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details and Contact */}
                    <div className="space-y-6 mt-6 lg:mt-0">
                        <div className="space-y-6">
                            <div>
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                                    {data.category || "Uncategorized"}
                                </span>
                                <h1 className="text-3xl font-black mt-4 text-white leading-tight">{data.title || "Untitled Ad"}</h1>
                                <div className="flex items-center gap-2 text-gray-500 mt-3 text-sm font-medium">
                                    <MapPin size={16} />
                                    <span>{data.location || "Location not set"}</span>
                                </div>
                            </div>

                            <div className="py-6 border-y border-white/5">
                                <p className="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Price (LKR)</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-white">
                                        {(data.category === "Vehicles" || data.category === "Property") && JSON.parse(data.attributes || "{}").hidePrice ? "Negotiable" : `Rs ${parseFloat(data.price || "0").toLocaleString()}`}
                                    </p>
                                    {(data.category === "Vehicles" || data.category === "Property") && JSON.parse(data.attributes || "{}").negotiable && !JSON.parse(data.attributes || "{}").hidePrice && (
                                        <span className="text-primary font-bold text-xs">Negotiable</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Calendar size={14} /> Posted on
                                    </span>
                                    <span className="text-gray-300">{new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-medium">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Tag size={14} /> Condition
                                    </span>
                                    <span className="text-gray-300 font-bold">{data.category === "Vehicles" ? JSON.parse(data.attributes || "{}").condition || "Used" : "New"}</span>
                                </div>
                                {data.category === "Vehicles" && data.attributes && (() => {
                                    const attr = JSON.parse(data.attributes);
                                    return (
                                        <>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-500">Manufacturer</span>
                                                <span className="text-gray-300 font-bold">{attr.manufacturer}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-500">Model</span>
                                                <span className="text-gray-300 font-bold">{attr.model}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-500">Year</span>
                                                <span className="text-gray-300 font-bold">{attr.modelYear}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-500">Mileage</span>
                                                <span className="text-gray-300 font-bold">{attr.mileage} km</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-500">Transmission</span>
                                                <span className="text-gray-300 font-bold">{attr.transmission}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-500">Fuel</span>
                                                <span className="text-gray-300 font-bold">{attr.fuelType}</span>
                                            </div>
                                        </>
                                    );
                                })()}
                                {data.category === "Property" && data.attributes && (() => {
                                    const attr = JSON.parse(data.attributes);
                                    return (
                                        <>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-500">Property Type</span>
                                                <span className="text-gray-300 font-bold">{attr.propertyType}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs font-medium">
                                                <span className="text-gray-500">Ad Type</span>
                                                <span className="text-gray-300 font-bold">{attr.propertyAdType}</span>
                                            </div>
                                            {attr.bedrooms && (
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className="text-gray-500">Bedrooms</span>
                                                    <span className="text-gray-300 font-bold">{attr.bedrooms}</span>
                                                </div>
                                            )}
                                            {attr.bathrooms && (
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className="text-gray-500">Bathrooms</span>
                                                    <span className="text-gray-300 font-bold">{attr.bathrooms}</span>
                                                </div>
                                            )}
                                            {attr.floors && (
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className="text-gray-500">Floors</span>
                                                    <span className="text-gray-300 font-bold">{attr.floors}</span>
                                                </div>
                                            )}
                                            {attr.area && (
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className="text-gray-500">Area</span>
                                                    <span className="text-gray-300 font-bold">{attr.area} sqft</span>
                                                </div>
                                            )}
                                            {attr.landSize && (
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className="text-gray-500">Land Size</span>
                                                    <span className="text-gray-300 font-bold">{attr.landSize} {attr.landMeasurement}</span>
                                                </div>
                                            )}
                                            {attr.propertyPriceType && (
                                                <div className="flex items-center justify-between text-xs font-medium">
                                                    <span className="text-gray-500">Price Type</span>
                                                    <span className="text-gray-300 font-bold">{attr.propertyPriceType}</span>
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="pt-6 space-y-4">
                                <div className="bg-black/60 p-5 rounded-2xl border border-white/10 space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
                                            {userName?.[0] || <User />}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Posted by Member</p>
                                            <p className="font-bold text-white text-lg">{userName}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Contact Information</p>
                                        <div className="space-y-2">
                                            {data.showPhone1 && data.phone1 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">P1</span>
                                                    <p className="text-primary font-bold">{data.phone1}</p>
                                                </div>
                                            )}
                                            {data.showPhone2 && data.phone2 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">P2</span>
                                                    <p className="text-primary font-bold">{data.phone2}</p>
                                                </div>
                                            )}
                                            {data.showPhone3 && data.phone3 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-400">P3</span>
                                                    <p className="text-primary font-bold">{data.phone3}</p>
                                                </div>
                                            )}
                                            {!data.showPhone1 && !data.showPhone2 && !data.showPhone3 && (
                                                <p className="text-[10px] text-gray-500 italic">No phone numbers selected for display</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/20">
                                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                                        <Shield size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Buyer Protection</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 leading-tight">
                                        Always meet in public places and never pay in advance. Your safety is our priority.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
