import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createOTP, sendOTPEmail } from "@/lib/otp";

export async function POST(req: Request) {
    try {
        const { email, name } = await req.json();

        if (!email) {
            return NextResponse.json(
                { message: "Email is required" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser && existingUser.emailVerified) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Generate and send OTP
        const otpRecord = await createOTP(email);
        const emailSent = await sendOTPEmail(email, otpRecord.token);

        if (!emailSent) {
            return NextResponse.json(
                { message: "Failed to send verification email. Please check your SMTP settings or try again." },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "OTP sent successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("DEBUG - Registration error:", error);
        return NextResponse.json(
            {
                message: `Registration error: ${error.message || "Unknown error"}`,
                details: error.code || "No error code"
            },
            { status: 500 }
        );
    }
}
