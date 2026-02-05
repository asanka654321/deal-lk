import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");

        if (!q || q.length < 2) {
            return NextResponse.json([]);
        }

        // Fetch categories matching the query
        const categories = await prisma.category.findMany({
            where: {
                name: {
                    contains: q,
                }
            },
            take: 3,
            select: { name: true }
        });

        // Fetch ads matching the query in title
        const ads = await prisma.ad.findMany({
            where: {
                status: "APPROVED",
                title: {
                    contains: q,
                }
            },
            take: 5,
            select: {
                title: true,
                category: {
                    select: { name: true }
                }
            }
        });

        const suggestions = [
            ...categories.map(c => ({ text: c.name, type: "category" })),
            ...ads.map(ad => ({ text: ad.title, type: "ad", category: ad.category.name }))
        ];

        return NextResponse.json(suggestions);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching suggestions" }, { status: 500 });
    }
}
