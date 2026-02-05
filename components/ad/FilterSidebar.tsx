"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { districts } from "@/lib/locations";
import SearchableSelect from "../ui/SearchableSelect";

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState({
        category: searchParams.get("category") || "All Categories",
        location: searchParams.get("location") || "All of Sri Lanka",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        condition: searchParams.get("condition") || "Used",
    });

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                const data = await res.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (filters.category && filters.category !== "All Categories") {
            params.set("category", filters.category.toLowerCase());
        } else {
            params.delete("category");
        }

        if (filters.location && filters.location !== "All of Sri Lanka") {
            params.set("location", filters.location);
        } else {
            params.delete("location");
        }

        if (filters.minPrice) params.set("minPrice", filters.minPrice);
        else params.delete("minPrice");

        if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
        else params.delete("maxPrice");

        router.push(`/ads?${params.toString()}`);
    };

    return (
        <div className="w-full flex-shrink-0 space-y-8">
            {/* Category Filter */}
            <div>
                <h3 className="font-semibold text-white mb-4">Categories</h3>
                <div className="space-y-2">
                    {["All Categories", "Vehicles", "Electronics", "Property", "Fashion", "Jobs", "Services"].map((cat) => (
                        <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="category"
                                checked={filters.category.toLowerCase() === cat.toLowerCase()}
                                onChange={() => updateFilter("category", cat)}
                                className="border-gray-700 bg-transparent text-primary focus:ring-primary"
                            />
                            <span className="text-gray-400 group-hover:text-primary transition-colors">{cat}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <SearchableSelect
                    label="Location"
                    value={filters.location}
                    onChange={(val) => updateFilter("location", val)}
                    options={["All of Sri Lanka", ...districts]}
                    placeholder="Filter by location"
                    searchPlaceholder="Search districts..."
                />
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-white mb-4">Price Range</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => updateFilter("minPrice", e.target.value)}
                        className="w-full p-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder-gray-600"
                    />
                    <span className="text-gray-600">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => updateFilter("maxPrice", e.target.value)}
                        className="w-full p-2 bg-transparent border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder-gray-600"
                    />
                </div>
            </div>

            {/* Condition */}
            <div>
                <h3 className="font-semibold text-white mb-4">Condition</h3>
                <div className="space-y-2">
                    {["New", "Used", "Reconditioned"].map((cond) => (
                        <label key={cond} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="radio"
                                name="condition"
                                checked={filters.condition === cond}
                                onChange={() => updateFilter("condition", cond)}
                                className="border-gray-700 bg-transparent text-primary focus:ring-primary"
                            />
                            <span className="text-gray-400 group-hover:text-primary transition-colors">{cond}</span>
                        </label>
                    ))}
                </div>
            </div>

            <Button onClick={applyFilters} className="w-full bg-secondary hover:bg-secondary/90">Apply Filters</Button>
        </div>
    );
}
