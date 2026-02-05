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

        const ads = await prisma.ad.findMany({
            include: {
                user: { select: { name: true, email: true, phone: true } },
                category: true,
                location: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(ads);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching ads" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id, status, title, price, description, images } = await req.json();

        if (!id) {
            return NextResponse.json({ message: "Missing id" }, { status: 400 });
        }

        const ad = await prisma.ad.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(title && { title }),
                ...(price && { price: parseFloat(price) }),
                ...(description && { description }),
                ...(images && { images }),
            },
        });

        return NextResponse.json(ad);
    } catch (error) {
        return NextResponse.json({ message: "Error updating ad status" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids)) {
            return NextResponse.json({ message: "Invalid ids" }, { status: 400 });
        }

        await prisma.ad.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return NextResponse.json({ message: "Ads deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting ads" }, { status: 500 });
    }
}
