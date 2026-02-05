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

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                createdAt: true,
                lastActive: true,
                _count: {
                    select: { ads: true }
                }
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
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

        // Check if user is trying to delete themselves
        if (ids.includes(session.user.id)) {
            return NextResponse.json({ message: "You cannot delete yourself" }, { status: 400 });
        }

        // Prevent deletion of Super Admin
        const superAdmin = await prisma.user.findFirst({
            where: { email: "admin@deal.lk" }
        });

        if (superAdmin && ids.includes(superAdmin.id)) {
            return NextResponse.json({ message: "Super Admin account cannot be deleted" }, { status: 400 });
        }

        await prisma.user.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        return NextResponse.json({ message: "Users deleted successfully" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting users" }, { status: 500 });
    }
}
