import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        await prisma.user.update({
            where: { id: session.user.id },
            data: { lastActive: new Date() },
        });

        return new NextResponse("OK", { status: 200 });
    } catch (error) {
        console.error("[HEARTBEAT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
