import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        const isCorrectPassword = await bcrypt.compare(currentPassword, user.password);
        if (!isCorrectPassword) {
            return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("[USER_PASSWORD_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
