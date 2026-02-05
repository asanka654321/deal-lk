import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifyOTP } from "@/lib/otp";

export async function POST(req: Request) {
    try {
        const { email, name, password, phone, city, token } = await req.json();

        if (!email || !password || !token) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify OTP
        const isValid = await verifyOTP(email, token);
        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Update or create user
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        let user;
        if (existingUser) {
            user = await prisma.user.update({
                where: { email },
                data: {
                    name,
                    password: hashedPassword,
                    phone: phone || null,
                    city: city || null,
                    emailVerified: new Date(),
                },
            });
        } else {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    phone: phone || null,
                    city: city || null,
                    emailVerified: new Date(),
                },
            });
        }

        return NextResponse.json(
            { message: "User verified and created successfully", user: { id: user.id, email: user.email } },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("DEBUG - Verification error:", error);
        return NextResponse.json(
            {
                message: `Verification error: ${error.message || "Unknown error"}`,
                details: error.code || "No error code"
            },
            { status: 500 }
        );
    }
}
