"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Upload, X, Loader2, Plus, Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { districts } from "@/lib/locations";
import { cities } from "@/lib/cities";
import AdPreview from "@/components/ad/AdPreview";
import SearchableSelect from "@/components/ui/SearchableSelect";
import {
    vehicleTypes,
    bodyTypes,
    manufacturers,
    commonModels,
    colours
} from "@/lib/vehicle-data";
import {
    propertyAdTypes,
    propertyCategories,
    propertyTypes,
    landMeasurements,
    propertyPriceTypes
} from "@/lib/property-data";

// Helper function to build attributes JSON string from formData
function buildAttributes(formData: any): string {
    if (formData.category === "Vehicles") {
        return JSON.stringify({
            type: formData.type,
            bodyType: formData.bodyType,
            manufacturer: formData.manufacturer,
            model: formData.model,
            condition: formData.condition,
            modelYear: formData.modelYear,
            registeredYear: formData.registeredYear,
            transmission: formData.transmission,
            fuelType: formData.fuelType,
            engineCapacity: formData.engineCapacity,
            mileage: formData.mileage,
            colour: formData.colour,
            negotiable: formData.negotiable,
            hidePrice: formData.hidePrice,
            onLease: formData.onLease,
        });
    } else if (formData.category === "Property") {
        return JSON.stringify({
            propertyAdType: formData.propertyAdType,
            propertyCategory: formData.propertyCategory,
            propertyType: formData.propertyType,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            floors: formData.floors,
            area: formData.area,
            landSize: formData.landSize,
            landMeasurement: formData.landMeasurement,
            propertyPriceType: formData.propertyPriceType,
            negotiable: formData.negotiable,
            hidePrice: formData.hidePrice,
        });
    }
    return "{}";
}

export default function PostAdPage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [step, setStep] = useState(1); // 1: Detail, 2: Preview
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        price: "",
        location: "Colombo",
        description: "",
        phone1: "",
        phone2: "",
        phone3: "",
        showPhone1: true,
        showPhone2: false,
        showPhone3: false,
        // Vehicle specific fields
        type: "Car",
        bodyType: "",
        manufacturer: "",
        model: "",
        condition: "Used",
        modelYear: "",
        registeredYear: "",
        transmission: "Automatic",
        fuelType: "Petrol",
        engineCapacity: "",
        mileage: "",
        colour: "",
        negotiable: false,
        hidePrice: false,
        onLease: false,
        // Property specific fields
        propertyAdType: "Sale",
        propertyCategory: "House",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        floors: "",
        area: "",
        landSize: "",
        landMeasurement: "",
        propertyPriceType: "Total Price",
    });

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    // Set primary phone from session
    if ((session?.user as any)?.phone && formData.phone1 === "") {
        setFormData(prev => ({ ...prev, phone1: (session?.user as any).phone }));
    }

    // Real image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            setImages((prev) => [...prev, data.url]);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            const res = await fetch("/api/ads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    images: JSON.stringify(images),
                    attributes: buildAttributes(formData)
                }),
            });

            if (!res.ok) throw new Error("Failed to create ad");

            router.push("/ads");
            router.refresh();
        } catch (error) {
            console.error("Error creating ad:", error);
            alert("Failed to create ad. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Stepper */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center gap-4">
                        <div className={`flex flex-col items-center gap-2`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= 1 ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]" : "border-gray-800 text-gray-500"
                                }`}>
                                {step > 1 ? <Check size={20} /> : "1"}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= 1 ? "text-primary" : "text-gray-600"}`}>Ad Detail</span>
                        </div>
                        <div className={`w-20 h-[2px] mb-6 transition-all duration-500 ${step > 1 ? "bg-primary" : "bg-gray-800"}`} />
                        <div className={`flex flex-col items-center gap-2`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step === 2 ? "bg-purple-600 border-purple-600 text-white shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "border-gray-800 text-gray-500"
                                }`}>
                                {step === 2 && <Check size={20} className="hidden" />}
                                2
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${step === 2 ? "text-purple-500" : "text-gray-600"}`}>Confirmation</span>
                        </div>
                    </div>
                </div>

                {step === 1 ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-white mb-2 italic">Post an Ad</h1>
                            <p className="text-gray-500 font-medium">Fill in the details to sell your item quickly.</p>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setStep(2);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="space-y-8 bg-surface p-8 rounded-[2rem] border border-gray-800 shadow-2xl"
                        >
                            {/* Basic Details */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-black text-white flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                                    Basic Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <SearchableSelect
                                        label="Category"
                                        required
                                        value={formData.category}
                                        onChange={(val) => setFormData({ ...formData, category: val })}
                                        options={[
                                            "Vehicles",
                                            "Electronics",
                                            "Property",
                                            "Jobs",
                                            "Fashion"
                                        ]}
                                        placeholder="Select Category"
                                    />

                                    <SearchableSelect
                                        label="Location"
                                        required
                                        value={formData.location}
                                        onChange={(val) => setFormData({ ...formData, location: val })}
                                        options={cities}
                                        placeholder="Select City"
                                        searchPlaceholder="Search cities..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Title</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. iPhone 14 Pro Max - 256GB"
                                        className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (LKR)</label>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rs</span>
                                            <input
                                                required
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white pl-12 pr-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={formData.price}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            />
                                        </div>
                                        <div className="flex items-center gap-6 px-2">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-gray-800 bg-black text-primary focus:ring-primary"
                                                    checked={formData.negotiable}
                                                    onChange={(e) => setFormData({ ...formData, negotiable: e.target.checked })}
                                                />
                                                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Negotiable</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 rounded border-gray-800 bg-black text-primary focus:ring-primary"
                                                    checked={formData.hidePrice}
                                                    onChange={(e) => setFormData({ ...formData, hidePrice: e.target.checked })}
                                                />
                                                <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">Hide Price from Listing</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Specific Details */}
                            {formData.category === "Vehicles" && (
                                <div className="border-t border-gray-800 pt-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                                        Vehicle Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Type */}
                                        <SearchableSelect
                                            label="Type"
                                            required
                                            value={formData.type}
                                            onChange={(val) => setFormData({ ...formData, type: val })}
                                            options={vehicleTypes}
                                            placeholder="Select Type"
                                        />

                                        {/* Body Type */}
                                        <SearchableSelect
                                            label="Body Type"
                                            required
                                            value={formData.bodyType}
                                            onChange={(val) => setFormData({ ...formData, bodyType: val })}
                                            options={bodyTypes}
                                            placeholder="Select a body type"
                                        />

                                        {/* Manufacturer */}
                                        <SearchableSelect
                                            label="Manufacturer"
                                            required
                                            value={formData.manufacturer}
                                            onChange={(val) => setFormData({ ...formData, manufacturer: val, model: "" })}
                                            options={manufacturers}
                                            placeholder="Select a manufacturer"
                                        />

                                        {/* Model */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Model</label>
                                            {formData.manufacturer && commonModels[formData.manufacturer] ? (
                                                <SearchableSelect
                                                    label="Model"
                                                    required
                                                    value={formData.model}
                                                    onChange={(val) => setFormData({ ...formData, model: val })}
                                                    options={[...(commonModels[formData.manufacturer] || []), "Other"]}
                                                    placeholder="Select a model"
                                                />
                                            ) : (
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Enter model"
                                                    className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    value={formData.model}
                                                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    </div>

                                    {/* Vehicle Condition */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle Condition</label>
                                        <div className="flex flex-wrap gap-6">
                                            {["Brand New", "Used", "Reconditioned"].map((condition) => (
                                                <label key={condition} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="radio"
                                                            name="condition"
                                                            className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-800 checked:border-primary transition-all cursor-pointer"
                                                            checked={formData.condition === condition}
                                                            onChange={() => setFormData({ ...formData, condition })}
                                                        />
                                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors ${formData.condition === condition ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                                                        {condition}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Model Year */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Model Year</label>
                                            <input
                                                required
                                                type="number"
                                                min="1900"
                                                max={new Date().getFullYear() + 1}
                                                placeholder="e.g. 2022"
                                                className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={formData.modelYear}
                                                onChange={(e) => setFormData({ ...formData, modelYear: e.target.value })}
                                            />
                                        </div>

                                        {/* Registered Year */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registered Year</label>
                                            <input
                                                type="number"
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                placeholder="e.g. 2023"
                                                className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={formData.registeredYear}
                                                onChange={(e) => setFormData({ ...formData, registeredYear: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Transmission */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Transmission</label>
                                        <div className="flex flex-wrap gap-6">
                                            {["Automatic", "Manual", "Tiptronic", "Other"].map((trans) => (
                                                <label key={trans} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="radio"
                                                            name="transmission"
                                                            className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-800 checked:border-primary transition-all cursor-pointer"
                                                            checked={formData.transmission === trans}
                                                            onChange={() => setFormData({ ...formData, transmission: trans })}
                                                        />
                                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors ${formData.transmission === trans ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                                                        {trans}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fuel Type */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fuel / Energy Type</label>
                                        <div className="flex flex-wrap gap-6">
                                            {["Petrol", "Diesel", "Hybrid", "Electric", "Other"].map((fuel) => (
                                                <label key={fuel} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="radio"
                                                            name="fuelType"
                                                            className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-800 checked:border-primary transition-all cursor-pointer"
                                                            checked={formData.fuelType === fuel}
                                                            onChange={() => setFormData({ ...formData, fuelType: fuel })}
                                                        />
                                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors ${formData.fuelType === fuel ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                                                        {fuel}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Engine Capacity */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Engine Capacity (CC)</label>
                                            <input
                                                required
                                                type="number"
                                                placeholder="e.g. 1500"
                                                className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={formData.engineCapacity}
                                                onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
                                            />
                                        </div>

                                        {/* Mileage */}
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mileage (KMS)</label>
                                            <input
                                                required
                                                type="number"
                                                placeholder="e.g. 45000"
                                                className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={formData.mileage}
                                                onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                                            />
                                        </div>

                                        {/* Colour */}
                                        <SearchableSelect
                                            label="Colour"
                                            required
                                            value={formData.colour}
                                            onChange={(val) => setFormData({ ...formData, colour: val })}
                                            options={colours}
                                            placeholder="Select a colour"
                                        />

                                        {/* On Lease */}
                                        <div className="space-y-3 flex flex-col justify-end">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Currently on Lease</label>
                                            <div className="flex gap-6 h-12 items-center">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="radio"
                                                            name="onLease"
                                                            className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-800 checked:border-primary transition-all cursor-pointer"
                                                            checked={formData.onLease === true}
                                                            onChange={() => setFormData({ ...formData, onLease: true })}
                                                        />
                                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors ${formData.onLease === true ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                                                        Yes
                                                    </span>
                                                </label>
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="radio"
                                                            name="onLease"
                                                            className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-800 checked:border-primary transition-all cursor-pointer"
                                                            checked={formData.onLease === false}
                                                            onChange={() => setFormData({ ...formData, onLease: false })}
                                                        />
                                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors ${formData.onLease === false ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                                                        No
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Property Specific Details */}
                            {formData.category === "Property" && (
                                <div className="border-t border-gray-800 pt-8 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <h2 className="text-xl font-black text-white flex items-center gap-3">
                                        <span className="w-1.5 h-6 bg-primary rounded-full" />
                                        Property Information
                                    </h2>

                                    {/* Ad Type */}
                                    <SearchableSelect
                                        label="Ad Type"
                                        required
                                        value={formData.propertyAdType}
                                        onChange={(val) => setFormData({ ...formData, propertyAdType: val })}
                                        options={propertyAdTypes}
                                        placeholder="Select an ad type"
                                    />

                                    {/* Property Category */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Property Category</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {propertyCategories.map((cat) => (
                                                <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="radio"
                                                            name="propertyCategory"
                                                            className="peer appearance-none w-5 h-5 rounded-full border-2 border-gray-800 checked:border-primary transition-all cursor-pointer"
                                                            checked={formData.propertyCategory === cat}
                                                            onChange={() => setFormData({ ...formData, propertyCategory: cat, propertyType: "" })}
                                                        />
                                                        <div className="absolute w-2.5 h-2.5 rounded-full bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200" />
                                                    </div>
                                                    <span className={`text-sm font-bold transition-colors ${formData.propertyCategory === cat ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                                                        {cat}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sub-type based on Category */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <SearchableSelect
                                            label={formData.propertyCategory === "Land" ? "Land Type" : "Type"}
                                            required
                                            value={formData.propertyType}
                                            onChange={(val) => setFormData({ ...formData, propertyType: val })}
                                            options={[...(propertyTypes[formData.propertyCategory] || []), "Other"]}
                                            placeholder="Select a type"
                                        />

                                        {(formData.propertyCategory === "Annexes and rooms" || formData.propertyCategory === "Featured projects" || formData.propertyCategory === "House") && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Floors</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 2"
                                                    className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    value={formData.floors}
                                                    onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {(formData.propertyCategory === "Featured projects" || formData.propertyCategory === "House" || formData.propertyCategory === "Land") && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                    Land Size {formData.propertyCategory === "Featured projects" && "(Optional)"}
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 10"
                                                    className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    value={formData.landSize}
                                                    onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                                                />
                                            </div>
                                            <SearchableSelect
                                                label={`Land Measurement ${formData.propertyCategory === "Featured projects" ? "(Optional)" : ""}`}
                                                value={formData.landMeasurement}
                                                onChange={(val) => setFormData({ ...formData, landMeasurement: val })}
                                                options={landMeasurements}
                                                placeholder="Select Measurement"
                                            />
                                        </div>
                                    )}

                                    {formData.propertyCategory === "Land" && (
                                        <SearchableSelect
                                            label="Property Price Type"
                                            required
                                            value={formData.propertyPriceType}
                                            onChange={(val) => setFormData({ ...formData, propertyPriceType: val })}
                                            options={propertyPriceTypes}
                                            placeholder="Select Type"
                                        />
                                    )}

                                    {(formData.propertyCategory === "Apartments" || formData.propertyCategory === "Commercial buildings" || formData.propertyCategory === "Featured projects" || formData.propertyCategory === "House") && (
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                Area (Square Feet) {formData.propertyCategory === "Featured projects" && "(Optional)"}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 1500"
                                                className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                value={formData.area}
                                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {(formData.propertyCategory === "Apartments" || formData.propertyCategory === "House" || formData.propertyCategory === "Annexes and rooms" || formData.propertyCategory === "Featured projects") && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bedrooms</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 3"
                                                    className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    value={formData.bedrooms}
                                                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Bathrooms</label>
                                                <input
                                                    type="number"
                                                    placeholder="e.g. 2"
                                                    className="w-full h-12 rounded-xl bg-black border border-gray-800 text-white px-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                                    value={formData.bathrooms}
                                                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="border-t border-gray-800 pt-8 space-y-6">
                                <h2 className="text-xl font-black text-white flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                                    Images
                                </h2>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-gray-800 bg-black group shadow-lg">
                                            <Image src={img} alt="Preview" fill className="object-cover transition-transform group-hover:scale-110" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(idx)}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 backdrop-blur-sm rounded-lg text-white hover:bg-red-600 transition-colors shadow-lg"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                            {idx === 0 && (
                                                <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-white text-[8px] font-black uppercase text-center py-1 tracking-widest">
                                                    Cover
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {images.length < 5 && (
                                        <label className="flex flex-col items-center justify-center aspect-square h-full border-2 border-dashed border-gray-800 rounded-2xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group relative overflow-hidden">
                                            <div className="flex flex-col items-center justify-center p-4">
                                                <Upload className={`w-8 h-8 ${uploading ? "animate-spin text-primary" : "text-gray-600 group-hover:text-primary"} mb-2 transition-colors`} />
                                                <p className="text-[10px] font-black text-gray-600 group-hover:text-primary uppercase tracking-widest text-center">
                                                    {uploading ? "Processing..." : "Add Photo"}
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleImageUpload}
                                                accept="image/*"
                                                disabled={uploading}
                                            />
                                        </label>
                                    )}
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest italic">Add up to 5 photos. High quality images sell faster.</p>
                            </div>

                            <div className="border-t border-gray-800 pt-8 space-y-6">
                                <h2 className="text-xl font-black text-white flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                                    Description
                                </h2>
                                <textarea
                                    required
                                    rows={6}
                                    placeholder="Describe your item in detail. Include features, condition, and why you're selling it..."
                                    className="w-full rounded-2xl bg-black border border-gray-800 text-white p-5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all placeholder:text-gray-600"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Contact Numbers */}
                            <div className="border-t border-gray-800 pt-8 space-y-6">
                                <h2 className="text-xl font-black text-white flex items-center gap-3">
                                    <span className="w-1.5 h-6 bg-primary rounded-full" />
                                    Contact Numbers
                                </h2>
                                <p className="text-gray-500 text-xs font-medium uppercase tracking-widest italic">
                                    Show up to 3 phone numbers. Check the box to make it visible to buyers.
                                </p>

                                <div className="space-y-4">
                                    {/* Phone 1 (Registered) */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-800 bg-black text-primary focus:ring-primary"
                                            checked={formData.showPhone1}
                                            onChange={(e) => setFormData({ ...formData, showPhone1: e.target.checked })}
                                        />
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone 1 (Registered)</label>
                                            <input
                                                readOnly
                                                type="text"
                                                className="w-full bg-transparent text-white font-bold outline-none border-none p-0 cursor-not-allowed opacity-70"
                                                value={formData.phone1}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone 2 */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-800 bg-black text-primary focus:ring-primary"
                                            checked={formData.showPhone2}
                                            onChange={(e) => setFormData({ ...formData, showPhone2: e.target.checked })}
                                        />
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone 2 (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="Enter secondary phone number"
                                                className="w-full bg-transparent text-white font-bold outline-none border-none p-0 focus:ring-0"
                                                value={formData.phone2}
                                                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Phone 3 */}
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded border-gray-800 bg-black text-primary focus:ring-primary"
                                            checked={formData.showPhone3}
                                            onChange={(e) => setFormData({ ...formData, showPhone3: e.target.checked })}
                                        />
                                        <div className="flex-1 space-y-1">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone 3 (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="Enter third phone number"
                                                className="w-full bg-transparent text-white font-bold outline-none border-none p-0 focus:ring-0"
                                                value={formData.phone3}
                                                onChange={(e) => setFormData({ ...formData, phone3: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={loading || uploading}
                                    className="w-full bg-primary hover:bg-primary/90 text-white h-14 text-lg font-black rounded-2xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Continue to Preview
                                </Button>
                            </div>

                        </form>
                    </div>
                ) : (
                    <AdPreview
                        data={{ ...formData, images, attributes: buildAttributes(formData) }}
                        onBack={() => setStep(1)}
                        onSubmit={handleSubmit}
                        loading={loading}
                        userName={session?.user?.name || "Member"}
                        userPhone={(session?.user as any)?.phone || ""}
                    />
                )}
            </div>
        </div>
    );
}
