import { PrismaClient } from '@prisma/client';
import { Pool as NeonPool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool as PgPool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const isProd = process.env.NODE_ENV === "production";
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.warn("[DB] WARNING: DATABASE_URL and NEON_DATABASE_URL are both missing or empty.");
} else {
  const maskedUrl = connectionString.replace(/:[^:@]+@/, ':***@');
  console.log(`[DB] Connection string found: ${maskedUrl.split('@')[1] || 'format unknown'}`);
}

const createPrismaClient = () => {
  let adapter;
  
  if (isProd) {
    if (!connectionString) {
      // Falhar explicitamente no pool se não houver URL em prod
      // Isso ajuda a debugar no Vercel
      throw new Error("DATABASE_URL must be defined for production!");
    }
    const pool = new NeonPool({ 
      connectionString,
      connectionTimeoutMillis: 10000,
    });
    adapter = new PrismaNeon(pool as any);
    console.log("[DB] Inicializando Neon Serverless adapter (Produção)");
  } else {
    const pool = new PgPool({ 
      connectionString,
      max: 10,
    });
    adapter = new PrismaPg(pool as any);
    console.log("[DB] Inicializando PG adapter (Desenvolvimento)");
  }
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
