import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const ads = await prisma.ad.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                category: true,
                location: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(ads);
    } catch (error) {
        console.error("[USER_ADS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { id, title, price, description } = body;

        // Verify ownership
        const existingAd = await prisma.ad.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existingAd || existingAd.userId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        const updatedAd = await prisma.ad.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(price && { price: parseFloat(price) }),
                ...(description && { description }),
                ...(body.images && { images: body.images }),
                status: "PENDING", // If user edits, it needs re-approval
            },
        });

        return NextResponse.json(updatedAd);
    } catch (error) {
        console.error("[USER_ADS_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return new NextResponse("Missing ID", { status: 400 });
        }

        // Verify ownership
        const existingAd = await prisma.ad.findUnique({
            where: { id },
            select: { userId: true }
        });

        if (!existingAd || existingAd.userId !== session.user.id) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await prisma.ad.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Ad deleted successfully" });
    } catch (error) {
        console.error("[USER_ADS_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
