const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
    console.log("Testing Resend with API Key:", process.env.RESEND_API_KEY ? "EXISTS" : "MISSING");
    try {
        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 't.a.a.perera@gmail.com',
            subject: 'Test Email',
            html: '<p>If you see this, Resend is working!</p>'
        });

        if (error) {
            console.error("Resend Error:", JSON.stringify(error, null, 2));
        } else {
            console.log("Success! Email sent. ID:", data.id);
        }
    } catch (err) {
        console.error("Crash during send:", err);
    }
}

testResend();
