import { prisma } from "@/lib/prisma";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/ad/ImageGallery";
import { MapPin, Calendar, Tag, Shield, Phone, User, Info } from "lucide-react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";

async function getAd(id: string) {
    const ad = await prisma.ad.findUnique({
        where: { id },
        include: {
            user: true,
            location: true,
            category: true,
        },
    });
    return ad;
}

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ad = await getAd(id);

    if (!ad) {
        notFound();
    }

    const images = JSON.parse(ad.images || "[]");

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Images and Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <ImageGallery images={images} />

                        <div className="bg-surface p-8 rounded-2xl border border-gray-800">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Info className="text-primary" />
                                Description
                            </h2>
                            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {ad.description}
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Details and Contact */}
                    <div className="space-y-6">
                        <div className="bg-surface p-6 rounded-2xl border border-gray-800 sticky top-24">
                            <div className="mb-6">
                                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                                    {ad.category.name}
                                </span>
                                <h1 className="text-3xl font-bold mt-4 line-clamp-2">{ad.title}</h1>
                                <div className="flex items-center gap-2 text-gray-400 mt-2 text-sm">
                                    <MapPin size={14} />
                                    <span>{ad.location.city}, {ad.location.district}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <p className="text-gray-500 text-sm uppercase font-bold tracking-widest mb-1">Price</p>
                                <p className="text-4xl font-black text-primary">Rs {ad.price.toLocaleString()}</p>
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-800">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Calendar size={16} /> Posted on
                                    </span>
                                    <span className="font-medium">{new Date(ad.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Tag size={16} /> Condition
                                    </span>
                                    <span className="font-medium">Used</span>
                                </div>
                            </div>

                            <div className="mt-8 space-y-3">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-xl uppercase">
                                            {ad.user.name?.[0] || <User />}
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-400">Seller</p>
                                            <p className="font-bold text-white">{ad.user.name}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-gray-800">
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Contact Information</p>
                                        <div className="space-y-2">
                                            {ad.showPhone1 && ad.phone1 && (
                                                <Button className="w-full h-12 text-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20" variant="default">
                                                    <Phone size={20} />
                                                    {ad.phone1}
                                                </Button>
                                            )}
                                            {ad.showPhone2 && ad.phone2 && (
                                                <Button className="w-full h-12 text-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20" variant="default">
                                                    <Phone size={20} />
                                                    {ad.phone2}
                                                </Button>
                                            )}
                                            {ad.showPhone3 && ad.phone3 && (
                                                <Button className="w-full h-12 text-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20" variant="default">
                                                    <Phone size={20} />
                                                    {ad.phone3}
                                                </Button>
                                            )}
                                            {!ad.showPhone1 && !ad.showPhone2 && !ad.showPhone3 && (
                                                <p className="text-sm text-gray-500 italic">No contact numbers visible</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                                    <div className="flex items-center gap-2 text-yellow-500 mb-2">
                                        <Shield size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Safety Tips</span>
                                    </div>
                                    <ul className="text-[10px] text-yellow-500/80 space-y-1 list-disc pl-3">
                                        <li>Meet in a public place</li>
                                        <li>Check the item before you buy</li>
                                        <li>Pay only after collecting the item</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
