import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// PostgreSQL standard client initialization with Driver Adapter
// This is required for serverless/Edge contexts in Prisma 7
const connectionString = process.env.NEON_DATABASE_URL;

if (!connectionString) {
  console.error("CRITICAL: DATABASE_URL is not defined in the environment!");
} else {
  console.log("Database connection initializing...");
}

const pool = new Pool({
  connectionString,
  max: 10,
  connectionTimeoutMillis: 15000, // Aumentado para 15s (Neon cold start)
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('[DB] Erro inesperado no pool de conexões:', err);
});

const adapter = new PrismaPg(pool as any);

const createPrismaClient = () => new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

export const prisma = (() => {
  if (process.env.NODE_ENV === "production") return createPrismaClient();

  // Em desenvolvimento, verificamos se o cliente global existe e se tem o novo modelo
  if (globalForPrisma.prisma) {
    const p = globalForPrisma.prisma as any;
    // Se o modelo contactMessage não existir no client já instanciado, forçamos recriação
    if (p.contactMessage) {
      return globalForPrisma.prisma;
    }
    console.log("[DB] contactMessage não encontrado. Recriando Prisma Client...");
  }

  const newClient = createPrismaClient();
  globalForPrisma.prisma = newClient;
  return newClient;
})();

console.log("[DB] Prisma Client carregado com adapter pg.");
