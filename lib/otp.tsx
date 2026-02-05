import { prisma } from "./prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export function generateOTP(length: number = 6): string {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits[crypto.randomInt(0, 10)];
    }
    return otp;
}

export async function createOTP(email: string) {
    const token = generateOTP();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete any existing tokens for this email to ensure only one active token.
    await prisma.verificationToken.deleteMany({
        where: { email },
    });

    return await prisma.verificationToken.create({
        data: {
            email,
            token,
            expires,
        },
    });
}

export async function verifyOTP(email: string, token: string) {
    const verificationToken = await prisma.verificationToken.findFirst({
        where: {
            email,
            token,
            expires: {
                gt: new Date(),
            },
        },
    });

    if (!verificationToken) {
        return false;
    }

    // Delete the token after successful verification
    await prisma.verificationToken.delete({
        where: { id: verificationToken.id },
    });

    return true;
}

export async function sendOTPEmail(email: string, otp: string) {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    console.log(`DEBUG - Attempting to send OTP via SMTP to: ${email}`);

    if (!emailUser || !emailPass) {
        console.error("CRITICAL: EMAIL_USER or EMAIL_PASS is not defined in .env file.");
        console.log(`[MOCK FALLBACK] OTP for ${email} is: ${otp}`);
        return true; // Return true to not block registration during dev if keys are missing
    }

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // Use STARTTLS
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        tls: {
            // Do not fail on invalid certificates (useful for some network environments)
            rejectUnauthorized: false
        }
    });

    try {
        console.log("DEBUG - Verifying SMTP connection...");
        await transporter.verify();
        console.log("DEBUG - SMTP connection verified.");

        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center;">
                <h1 style="color: #0070f3;">Verify Your Email</h1>
                <p style="font-size: 16px; color: #333;">
                    Thank you for registering with Deal.lk. Please use the following code to verify your email address (<strong>${email}</strong>):
                </p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px; display: inline-block;">
                    ${otp}
                </div>
                <p style="font-size: 14px; color: #666;">
                    This code will expire in 10 minutes.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #999;">
                    If you did not request this, please ignore this email.
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: `"Deal.lk" <${emailUser}>`,
            to: email,
            subject: 'Verify your email - Deal.lk',
            html: html,
        });

        console.log("DEBUG - Email sent successfully via Gmail SMTP.");
        return true;
    } catch (err: any) {
        console.error("DEBUG - Failed to send email via SMTP:");
        console.error("Error Message:", err.message);
        console.error("Error Code:", err.code);
        console.error("Error Stack:", err.stack);
        return false;
    }
}
