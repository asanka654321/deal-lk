"use client";

import { cities } from "@/lib/cities";
import SearchableSelect from "../ui/SearchableSelect";

interface CityPickerProps {
    value: string;
    onChange: (city: string) => void;
}

export default function CityPicker({ value, onChange }: CityPickerProps) {
    return (
        <SearchableSelect
            label="City"
            value={value}
            onChange={onChange}
            options={cities}
            placeholder="Select a city"
            searchPlaceholder="Search cities..."
        />
    );
}
