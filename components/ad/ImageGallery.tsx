"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
    images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images || images.length === 0) {
        return (
            <div className="aspect-[4/3] w-full bg-gray-900 rounded-2xl flex items-center justify-center text-gray-500">
                No images available
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full bg-gray-900 rounded-2xl overflow-hidden group">
                <Image
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${currentIndex === index ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
