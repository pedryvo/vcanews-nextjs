import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { NextAuthOptions } from "next-auth";

const isDev = process.env.NODE_ENV === "development";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    ...(isDev
      ? [
          CredentialsProvider({
            name: "Developer Login",
            credentials: {
              email: { label: "Email", type: "email", placeholder: "admin@example.com" },
            },
            async authorize(credentials) {
              if (!credentials?.email) return null;

              // Enforce that only users already in the DB can use this in dev
              const user = await prisma.user.findUnique({
                where: { email: credentials.email },
              });

              if (user) {
                return user as any;
              }

              return null;
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.username = user.username;
        token.isBlocked = user.isBlocked ?? false;
        token.name = user.name;
        token.picture = user.image;
        token.birthDate = user.birthDate;
      }

      if (trigger === "update") {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id }
        });
        if (updatedUser) {
          token.username = updatedUser.username;
          token.name = updatedUser.name;
          token.picture = updatedUser.image;
          token.birthDate = updatedUser.birthDate;
          token.isBlocked = updatedUser.isBlocked;
          token.role = updatedUser.role || "USER";
        }
      }

      if (token.email === process.env.ADMIN_USER) {
        token.role = "ADMIN";
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
        session.user.birthDate = token.birthDate;
        session.user.isBlocked = token.isBlocked;
      }
      return session;
    },
    async signIn({ user }) {
      if (user.isBlocked) {
        throw new Error("Sua conta está bloqueada.");
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};
