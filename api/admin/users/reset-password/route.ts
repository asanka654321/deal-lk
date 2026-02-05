import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { userId, newPassword } = await req.json();

        if (!userId || !newPassword) {
            return NextResponse.json({ message: "Missing userId or newPassword" }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Password reset error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
