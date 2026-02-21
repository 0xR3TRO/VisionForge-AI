import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
    session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID ?? "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password,
                );
                if (!isValid) {
                    throw new Error("Invalid email or password");
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await prisma.user.findUnique({
                    where: { id: user.id },
                    select: { id: true, role: true, credits: true, tier: true },
                });
                if (dbUser) {
                    token.id = dbUser.id;
                    token.role = dbUser.role;
                    token.credits = dbUser.credits;
                    token.tier = dbUser.tier;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
                session.user.credits = token.credits as number;
                session.user.tier = token.tier as string;
            }
            return session;
        },
    },
};

// Extend types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            credits: number;
            tier: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
        credits: number;
        tier: string;
    }
}
