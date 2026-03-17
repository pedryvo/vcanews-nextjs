import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { AdapterUser as BaseAdapterUser } from "next-auth/adapters";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username?: string | null;
      birthDate?: Date | null;
      isBlocked: boolean;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    username?: string | null;
    birthDate?: Date | null;
    isBlocked: boolean;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends BaseAdapterUser {
    role?: string;
    username?: string | null;
    birthDate?: Date | null;
    isBlocked?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    username?: string | null;
    birthDate?: Date | null;
    isBlocked: boolean;
  }
}
