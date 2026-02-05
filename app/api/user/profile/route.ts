import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { name, phone, city } = body;

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...(name && { name }),
                ...(phone && { phone }),
                ...(city !== undefined && { city }),
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[USER_PROFILE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Delete all ads belonging to the user first
        await prisma.ad.deleteMany({
            where: { userId: session.user.id },
        });

        // Delete the user account
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        return new NextResponse("Account Deleted", { status: 200 });
    } catch (error) {
        console.error("[USER_PROFILE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
