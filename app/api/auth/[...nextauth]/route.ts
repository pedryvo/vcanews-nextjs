import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Provedor de credenciais apenas para desenvolvimento automágico
    CredentialsProvider({
      id: "credentials",
      name: "Desenvolvimento",
      credentials: {},
      async authorize() {
        if (process.env.NODE_ENV !== "development") return null;
        
        // Lógica de alternância (cycling) entre dev e dev2
        const cacheDir = join(process.cwd(), ".next", "cache");
        const cycleFile = join(cacheDir, "dev-user-cycle.txt");
        let userId = "dev-user";

        try {
          if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });
          
          if (existsSync(cycleFile)) {
            const lastId = readFileSync(cycleFile, "utf-8").trim();
            userId = lastId === "dev-user" ? "dev-user-2" : "dev-user";
          }
          writeFileSync(cycleFile, userId);
        } catch (e) {
          console.error("Erro ao gerenciar ciclo de usuários dev:", e);
        }

        const devUser = await prisma.user.findUnique({
          where: { id: userId }
        });

        return devUser as any;
      }
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.username = (user as any).username;
      }

      // Se o update() for chamado no client, atualizamos o token com os dados novos do DB
      if (trigger === "update") {
        const updatedUser = await prisma.user.findUnique({
          where: { id: token.id }
        });
        if (updatedUser) {
          token.username = updatedUser.username;
          token.name = updatedUser.name;
          token.picture = updatedUser.image;
        }
      }

      if (token.email === process.env.ADMIN_USER) {
        token.role = "ADMIN";
      }

      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
