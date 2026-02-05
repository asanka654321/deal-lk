export const vehicleTypes = ["Car", "Van", "Bike", "SUV / Jeep", "Pickup", "Bus", "Lorry", "Three-wheeler", "Tractor", "Heavy-duty", "Other"];

export const bodyTypes = [
    "Sedan", "Hatchback", "SUV", "Crossover", "Coupe", "Convertible", "Wagon",
    "MPV", "Van", "Pickup", "High Roof", "Standard Roof", "Other"
];

export const manufacturers = [
    "Toyota", "Honda", "Nissan", "Mitsubishi", "Suzuki", "Mazda", "Micro",
    "Mercedes-Benz", "BMW", "Audi", "Hyundai", "Kia", "Land Rover", "Range Rover",
    "Jaguar", "Porsche", "Lexus", "Subaru", "Daihatsu", "Isusu", "Hino",
    "Mahindra", "Tata", "Bajaj", "TVS", "Hero", "Yamaha", "Peugeot", "Renault", "MG"
];

export const commonModels: Record<string, string[]> = {
    "Toyota": ["Corolla", "Vitz", "Aqua", "Prius", "Axio", "Allion", "Premio", "Land Cruiser", "Prado", "Hilux", "Hiace", "Camry", "Passo", "CHR"],
    "Honda": ["Civic", "Fit", "Grace", "Vezel", "CR-V", "Accord", "Insight", "Shuttle"],
    "Nissan": ["Dayz", "X-Trail", "Sunny", "Leaf", "Patrol", "Navara", "March", "Bluebird"],
    "Mitsubishi": ["Montero", "Lancer", "Pajero", "L200", "Outlander", "Mirage"],
    "Suzuki": ["Alto", "Wagon R", "Swift", "Celerio", "Vitara", "Jimny", "Every"],
    "Mazda": ["Axela", "Demio", "CX-5", "Mazda 3", "Mazda 6", "BT-50"],
    "Micro": ["Panda", "Privilege", "Kyron", "Rexton"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLA", "GLC", "GLE"],
    "BMW": ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5"],
};

export const colours = [
    "White", "Black", "Silver", "Grey", "Blue", "Red", "Gold", "Beige", "Brown", "Green", "Orange", "Yellow", "Purple", "Other"
];
