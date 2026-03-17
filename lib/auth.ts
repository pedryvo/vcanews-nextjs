import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.username = (user as any).username;
        token.isBlocked = (user as any).isBlocked;
        token.name = user.name;
        token.picture = user.image;
        token.birthDate = (user as any).birthDate;
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
    async session({ session, token }: any) {
      if (token && (session as any).user) {
        (session as any).user.id = token.id;
        (session as any).user.role = token.role;
        (session as any).user.username = token.username;
        (session as any).user.birthDate = token.birthDate;
        (session as any).user.isBlocked = token.isBlocked;
      }
      return session;
    },
    async signIn({ user }: any) {
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
