import AdCard from "../ad/AdCard";
import { Button } from "../ui/Button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const DEMO_ADS = [
    {
        id: "1",
        title: "Toyota Land Cruiser Prado 2024",
        price: 35000000,
        location: "Colombo, Sri Lanka",
        image: "https://images.unsplash.com/photo-1594502184342-28f3790f4024?q=80&w=2670&auto=format&fit=crop",
        category: "Vehicles",
        date: "2 hours ago",
        featured: true,
    },
    {
        id: "2",
        title: "Luxury Apartment in Colombo 03",
        price: 85000000,
        location: "Colombo 03",
        image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2670&auto=format&fit=crop",
        category: "Property",
        date: "5 hours ago",
        featured: true,
    },
    {
        id: "3",
        title: "iPhone 15 Pro Max - 256GB",
        price: 450000,
        location: "Kandy",
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=2670&auto=format&fit=crop",
        category: "Electronics",
        date: "1 day ago",
        featured: false,
    },
    {
        id: "4",
        title: "MacBook Pro M3 Max",
        price: 950000,
        location: "Galle",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?q=80&w=2626&auto=format&fit=crop",
        category: "Electronics",
        date: "Just now",
        featured: true,
    },
];

export default function FeaturedAds() {
    return (
        <section className="py-16 bg-black">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Featured Listings</h2>
                        <p className="text-gray-400">Hand-picked premium deals for you</p>
                    </div>
                    <Link href="/ads">
                        <Button variant="ghost" className="hidden sm:flex items-center gap-2 group text-gray-300 hover:text-white">
                            View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {DEMO_ADS.map((ad) => (
                        <AdCard key={ad.id} {...ad} />
                    ))}
                </div>

                <div className="mt-8 text-center sm:hidden">
                    <Button variant="outline" className="w-full">View All Ads</Button>
                </div>
            </div>
        </section>
    );
}
