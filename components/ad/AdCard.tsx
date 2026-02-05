import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart } from "lucide-react";

interface AdCardProps {
    id: string;
    title: string;
    price: number;
    location: string;
    image: string;
    category: string;
    date: string;
    featured?: boolean;
}

export default function AdCard({ id, title, price, location, image, category, date, featured }: AdCardProps) {
    return (
        <div className={`group relative bg-surface rounded-xl shadow-sm hover:shadow-md hover:shadow-primary/10 transition-all duration-300 border overflow-hidden ${featured ? 'border-secondary/50 ring-1 ring-secondary/20' : 'border-gray-800'}`}>
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black text-white hover:text-red-500 transition-colors backdrop-blur-sm">
                    <Heart className="w-4 h-4" />
                </button>
                {featured && (
                    <span className="absolute top-3 left-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        FEATURED
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <Link href={`/ad/${id}`} className="block">
                        <h3 className="font-semibold text-white group-hover:text-primary transition-colors line-clamp-2">
                            {title}
                        </h3>
                    </Link>
                </div>

                <p className="text-lg font-bold text-primary mb-2">
                    Rs {price.toLocaleString()}
                </p>

                <div className="flex items-center text-sm text-gray-400 gap-1 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{location}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-800">
                    <span>{category}</span>
                    <span>{date}</span>
                </div>
            </div>
        </div>

    );
}
