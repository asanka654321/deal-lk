import * as React from 'react';

interface VerificationEmailProps {
    otp: string;
    email: string;
}

export const VerificationEmail: React.FC<Readonly<VerificationEmailProps>> = ({
    otp,
    email,
}) => (
    <div style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f9f9f9',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center'
    }}>
        <h1 style={{ color: '#0070f3' }}>Verify Your Email</h1>
        <p style={{ fontSize: '16px', color: '#333' }}>
            Thank you for registering with Deal.lk. Please use the following code to verify your email address (<strong>{email}</strong>):
        </p>
        <div style={{
            fontSize: '32px',
            fontWeight: 'bold',
            letterSpacing: '5px',
            margin: '20px 0',
            padding: '10px',
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            display: 'inline-block'
        }}>
            {otp}
        </div>
        <p style={{ fontSize: '14px', color: '#666' }}>
            This code will expire in 10 minutes.
        </p>
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
        <p style={{ fontSize: '12px', color: '#999' }}>
            If you did not request this, please ignore this email.
        </p>
    </div>
);
