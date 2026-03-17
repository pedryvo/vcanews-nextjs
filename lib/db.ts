import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// PostgreSQL standard client initialization with Driver Adapter
// This is required for serverless/Edge contexts in Prisma 7
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("CRITICAL: DATABASE_URL is not defined in the environment!");
} else {
  console.log("Database connection initializing...");
}

const pool = new Pool({ 
  connectionString,
  max: 1, 
  connectionTimeoutMillis: 15000, // Aumentado para 15s (Neon cold start)
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('[DB] Erro inesperado no pool de conexões:', err);
});

const adapter = new PrismaPg(pool as any);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

console.log("[DB] Prisma Client carregado com adapter pg.");

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
