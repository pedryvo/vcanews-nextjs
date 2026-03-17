import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Detecção robusta de ambiente
const isVercel = !!process.env.VERCEL;
const isProd = process.env.NODE_ENV === "production" || isVercel;

// Prioridade para DATABASE_URL em produção, NEON_DATABASE_URL como fallback
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

const createPrismaClient = () => {
  console.log(`[DB] Inicializando Prisma (Driver PG). Amb: ${process.env.NODE_ENV}, Vercel: ${isVercel}, BuildPhase: ${isBuildPhase}`);
  
  if (!connectionString) {
    console.warn("[DB] AVISO: Nenhuma string de conexão encontrada.");
    if (isProd && !isBuildPhase) {
       console.error("[DB] ERRO: Conexão obrigatória em Produção!");
    }
  }

  // Usando driver PG padrão (TCP) para todos os ambientes
  const pool = new Pool({ 
    connectionString: connectionString || undefined,
    max: isProd ? 10 : 1,
    connectionTimeoutMillis: 15000,
  });

  const adapter = new PrismaPg(pool as any);
  
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
