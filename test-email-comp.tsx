import { Resend } from 'resend';
import * as React from 'react';
import { VerificationEmail } from './components/emails/VerificationEmail';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmailComponent() {
    console.log("Testing Resend with React Component...");
    const otp = "123456";
    const email = "t.a.a.perera@gmail.com";

    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: [email],
            subject: 'Test Email with Component',
            react: <VerificationEmail otp={otp} email={email} />,
        });

        if (error) {
            console.error("Resend Error:", JSON.stringify(error, null, 2));
        } else {
            console.log("Success! Email sent with component. ID:", data?.id);
        }
    } catch (err) {
        console.error("Crash during send:", err);
    }
}

testEmailComponent();
