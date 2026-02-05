import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FilterSidebar from "@/components/ad/FilterSidebar";
import AdCard from "@/components/ad/AdCard";
import SearchBar from "@/components/ad/SearchBar";
import { prisma } from "@/lib/prisma";
import { ChevronDown } from "lucide-react";

// Force dynamic rendering to ensure new ads appear immediately
export const dynamic = 'force-dynamic';

async function getAds(params: { category?: string; q?: string; minPrice?: string; maxPrice?: string; location?: string }) {
    const { category, q, minPrice, maxPrice, location } = params;

    const where: any = {
        status: "APPROVED",
    };

    if (category && category.toLowerCase() !== "all categories") {
        where.category = {
            name: {
                contains: category,
            }
        };
    }

    if (q) {
        where.OR = [
            { title: { contains: q, } },
            { description: { contains: q, } },
        ];
    }

    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice);
        if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (location && location.toLowerCase() !== "all of sri lanka") {
        where.location = {
            city: {
                contains: location,
            }
        };
    }

    return await prisma.ad.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { location: true, category: true },
    });
}

export default async function AdsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const q = typeof params.q === "string" ? params.q : undefined;
    const category = typeof params.category === "string" ? params.category : undefined;
    const minPrice = typeof params.minPrice === "string" ? params.minPrice : undefined;
    const maxPrice = typeof params.maxPrice === "string" ? params.maxPrice : undefined;
    const location = typeof params.location === "string" ? params.location : undefined;

    const ads = await getAds({ category, q, minPrice, maxPrice, location });

    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            {/* Page Header */}
            <div className="bg-primary/10 pt-24 pb-12 border-b border-gray-800">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Browse Ads</h1>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <SearchBar initialQuery={q} category={category} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Filters */}
                <aside className="hidden lg:block w-64 bg-surface p-4 rounded-xl border border-gray-800 h-fit">
                    <FilterSidebar />
                </aside>

                {/* Mobile Filter Toggle (Hidden on Desktop) */}
                <div className="lg:hidden mb-4">
                    <button className="w-full py-2 bg-surface border border-gray-800 rounded-md font-medium text-white hover:bg-gray-800">
                        Filters
                    </button>
                </div>

                {/* Ads Grid */}
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-400">Showing {ads.length} ads</span>
                        <div className="relative">
                            <select className="border border-gray-800 rounded-md bg-surface font-medium text-white pl-3 pr-8 py-1 focus:ring-1 focus:ring-primary cursor-pointer outline-none appearance-none">
                                <option>Newest First</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>

                    {ads.length === 0 ? (
                        <div className="text-center py-20 bg-surface rounded-xl border border-gray-800">
                            <h3 className="text-xl font-semibold text-white mb-2">No ads found</h3>
                            <p className="text-gray-400">Be the first to post an ad!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {ads.map((ad) => {
                                // Parse JSON images
                                let imageUrl = "https://images.unsplash.com/photo-1594502184342-28f3790f4024?q=80&w=2670&auto=format&fit=crop";
                                try {
                                    const parsedImages = JSON.parse(ad.images);
                                    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                                        const firstImage = parsedImages[0];
                                        if (firstImage && !firstImage.startsWith("blob:")) {
                                            imageUrl = firstImage;
                                        }
                                    }
                                } catch (e) { }

                                return (
                                    <AdCard
                                        key={ad.id}
                                        id={ad.id}
                                        title={ad.title}
                                        price={ad.price}
                                        location={ad.location.city} // Use proper relation access
                                        image={imageUrl}
                                        category={ad.category.name} // Use proper relation access
                                        date={new Date(ad.createdAt).toLocaleDateString()}
                                        featured={ad.featured}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
