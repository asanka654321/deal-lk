import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            title, description, price, category, location, images,
            phone1, phone2, phone3, showPhone1, showPhone2, showPhone3, attributes
        } = body;

        // In a real app, you would validate the fields here (Zod)

        // Ensure database entities exist (Category, Location)
        // For this MVP, we'll try to find them or create them on the fly
        // NOTE: In a real app, these should be pre-seeded constants

        // 1. Handle Category
        const categoryRecord = await prisma.category.upsert({
            where: { name: category },
            update: {},
            create: { name: category },
        });

        // 2. Handle Location
        // We assume location string is something simple for now or map it
        const locationRecord = await prisma.location.upsert({
            where: { district_city: { district: "All of Sri Lanka", city: location } }, // Simplified for now since 'location' is the city name from lib/cities
            update: {},
            create: { district: "All of Sri Lanka", city: location },
        });

        // 3. Create Ad
        const ad = await prisma.ad.create({
            data: {
                title,
                description,
                price,
                images: images, // JSON string
                userId: session.user.id,
                categoryId: categoryRecord.id,
                locationId: locationRecord.id,
                phone1,
                phone2,
                phone3,
                showPhone1: !!showPhone1,
                showPhone2: !!showPhone2,
                showPhone3: !!showPhone3,
                attributes,
                status: "PENDING",
                featured: false,
            },
        });

        return NextResponse.json(ad);
    } catch (error) {
        console.error("[ADS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
