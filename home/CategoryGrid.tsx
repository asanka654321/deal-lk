import Link from "next/link";
import { Car, Smartphone, Home, Briefcase, Shirt, Music, MoreHorizontal } from "lucide-react";

const categories = [
    { name: "Vehicles", icon: Car, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Electronics", icon: Smartphone, color: "text-orange-400", bg: "bg-orange-500/10" },
    { name: "Property", icon: Home, color: "text-green-400", bg: "bg-green-500/10" },
    { name: "Jobs", icon: Briefcase, color: "text-purple-400", bg: "bg-purple-500/10" },
    { name: "Fashion", icon: Shirt, color: "text-pink-400", bg: "bg-pink-500/10" },
    { name: "Hobbies", icon: Music, color: "text-red-400", bg: "bg-red-500/10" },
    { name: "More", icon: MoreHorizontal, color: "text-gray-400", bg: "bg-gray-500/10" },
];

export default function CategoryGrid() {
    return (
        <section className="py-24 bg-black relative">
            <div className="container mx-auto px-4">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-10 h-10 rounded-full bg-[#14B8A6]/20 border border-[#14B8A6]/30 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-[#14B8A6] flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_10px_rgba(20,184,166,0.5)]">N</div>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter">Browse by Category</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={`/ads?category=${cat.name.toLowerCase()}`}
                            className="group flex flex-col items-center justify-center p-8 bg-white/[0.02] rounded-3xl border border-white/5 hover:border-[#3B82F6]/30 hover:bg-white/[0.05] hover:-translate-y-2 transition-all duration-500 shadow-2xl overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className={`p-5 rounded-2xl ${cat.bg} mb-5 group-hover:scale-110 transition-transform duration-500 relative z-10 shadow-lg`}>
                                <cat.icon className={`w-8 h-8 ${cat.color}`} />
                            </div>
                            <span className="font-bold text-gray-400 group-hover:text-white transition-colors relative z-10 tracking-wide text-sm">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
