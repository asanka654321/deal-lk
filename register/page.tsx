"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { signIn } from "next-auth/react";
import CityPicker from "@/components/auth/CityPicker";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Details, 2: OTP
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        otp: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email, name: data.name }),
            });

            if (res.ok) {
                setStep(2);
                setTimer(60); // 60 seconds resend timer
            } else {
                const errorData = await res.json();
                setError(errorData.message || "Something went wrong");
            }
        } catch (err: any) {
            console.error("Fetch error during OTP send:", err);
            setError(`Network error: ${err.message || "Please check if your server is running"}`);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    token: data.otp,
                }),
            });

            if (res.ok) {
                // Sign in the user automatically after verification
                const result = await signIn("credentials", {
                    redirect: false,
                    email: data.email,
                    password: data.password,
                });

                if (result?.error) {
                    router.push("/login");
                } else {
                    router.push("/");
                    router.refresh();
                }
            } else {
                const errorData = await res.json();
                setError(errorData.message || "Invalid OTP");
            }
        } catch (err: any) {
            console.error("Fetch error during OTP verify:", err);
            setError(`Network error: ${err.message || "Please check if your server is running"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black px-4">
            <div className="w-full max-w-md space-y-8 bg-surface p-8 rounded-2xl border border-gray-800">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        {step === 1 ? "Create an Account" : "Verify Email"}
                    </h1>
                    <p className="mt-2 text-sm text-gray-400">
                        {step === 1
                            ? "Join Deal.lk to start posting ads"
                            : `Enter the code sent to ${data.email}`}
                    </p>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-sm text-red-500 text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    className="mt-1 block w-full rounded-lg bg-black border border-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                                    placeholder="John Doe"
                                    value={data.name}
                                    onChange={(e) => setData({ ...data, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="mt-1 block w-full rounded-lg bg-black border border-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                                    placeholder="you@example.com"
                                    value={data.email}
                                    onChange={(e) => setData({ ...data, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    className="mt-1 block w-full rounded-lg bg-black border border-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                                    placeholder="07XXXXXXXX"
                                    value={data.phone}
                                    onChange={(e) => setData({ ...data, phone: e.target.value })}
                                />
                            </div>

                            <CityPicker
                                value={data.city}
                                onChange={(city) => setData({ ...data, city })}
                            />

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="mt-1 block w-full rounded-lg bg-black border border-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                                    placeholder="••••••••"
                                    value={data.password}
                                    onChange={(e) => setData({ ...data, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-10"
                            disabled={loading}
                        >
                            {loading ? "Sending code..." : "Sign up"}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-gray-400">Already have an account? </span>
                            <Link href="/login" className="font-medium text-primary hover:text-primary/80">
                                Sign in
                            </Link>
                        </div>
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                                Verification Code
                            </label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                maxLength={6}
                                className="mt-1 block w-full rounded-lg bg-black border border-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-center text-2xl tracking-[1em] transition-colors"
                                placeholder="000000"
                                value={data.otp}
                                onChange={(e) => setData({ ...data, otp: e.target.value })}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg h-10"
                            disabled={loading || data.otp.length !== 6}
                        >
                            {loading ? "Verifying..." : "Verify & Create Account"}
                        </Button>

                        <div className="text-center space-y-4">
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={timer > 0 || loading}
                                className="text-sm font-medium text-primary hover:text-primary/80 disabled:text-gray-600 transition-colors"
                            >
                                {timer > 0 ? `Resend code in ${timer}s` : "Resend code"}
                            </button>
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Back to registration
                                </button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
