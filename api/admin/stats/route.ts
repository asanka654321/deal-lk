import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const [totalAds, pendingAds, totalUsers, featuredAds] = await Promise.all([
            prisma.ad.count(),
            prisma.ad.count({ where: { status: "PENDING" } }),
            prisma.user.count(),
            prisma.ad.count({ where: { featured: true } }),
        ]);

        return NextResponse.json({
            stats: {
                totalAds,
                pendingAds,
                totalUsers,
                featuredAds,
            }
        });
    } catch (error) {
        console.error("Stats error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
