import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }

                console.log("Login attempt for email:", credentials.email);
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!user) {
                    console.log("User not found in database");
                    throw new Error("Invalid credentials");
                }

                if (!user.password) {
                    console.log("User has no password (OAuth user?)");
                    throw new Error("Invalid credentials");
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                console.log("Password comparison result:", isCorrectPassword);

                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials");
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === "google") {
                // Check if user exists
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (!existingUser) {
                    // Create new user for Google OAuth
                    await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name || "",
                            role: "USER",
                            // No password for OAuth users
                        },
                    });
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                (session.user as any).phone = token.phone as string;
            }
            return session;
        },
        async jwt({ token, user, trigger, session, account }) {
            if (user) {
                // Fetch full user data from database
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email! },
                });

                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.phone = dbUser.phone;
                }
            }

            // Handle session update
            if (trigger === "update" && session) {
                if (session.name) token.name = session.name;
                if (session.phone) token.phone = session.phone;
            }

            return token;
        },
    },
    session: {
        strategy: "jwt",
    },
};
