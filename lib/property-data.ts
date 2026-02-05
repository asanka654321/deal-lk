export const propertyAdTypes = ["Sale", "Rent"];

export const propertyCategories = [
    "Annexes and rooms",
    "Apartments",
    "Commercial buildings",
    "Featured projects",
    "House",
    "Land"
];

export const propertyTypes: Record<string, string[]> = {
    "Annexes and rooms": ["Annexes", "Partitions", "Rooms"],
    "Apartments": ["Furnished", "Luxury", "Semi luxury", "Unfurnished"],
    "House": ["Single Story", "Two Story", "Three Story", "Other"],
    "Commercial buildings": [
        "Building",
        "Factory / workshop",
        "Hotel",
        "Office",
        "Restaurant",
        "Shop",
        "Warehouse / storage"
    ],
    "Land": ["Agricultural", "Commercial", "Residential", "Other"],
    "Featured projects": ["Holiday bungalow", "Seasonal room"]
};

export const landMeasurements = ["Acres", "Perches", "Unit"];

export const propertyPriceTypes = ["Total Price", "Price per perch", "Price per acre"];
