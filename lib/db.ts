import { PrismaClient } from '@prisma/client';
import { Pool as NeonPool } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool as PgPool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Detecção robusta de ambiente
const isVercel = !!process.env.VERCEL;
const isProd = process.env.NODE_ENV === "production" || isVercel;

// Prioridade para DATABASE_URL em produção, NEON_DATABASE_URL como fallback
// Nota: DIRECT_URL é reservado para migrações em prisma.config.ts
const connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;

const createPrismaClient = () => {
  console.log(`[DB] Inicializando Prisma. Amb: ${process.env.NODE_ENV}, Vercel: ${isVercel}, ProdMode: ${isProd}`);
  
  if (!connectionString) {
    const errorMsg = "[DB] ERRO CRÍTICO: Nenhuma string de conexão encontrada (DATABASE_URL ou NEON_DATABASE_URL).";
    console.error(errorMsg);
    if (isProd) throw new Error(errorMsg);
  } else {
    const masked = connectionString.replace(/:[^:@]+@/, ':***@');
    console.log(`[DB] String de conexão detectada: ${masked.includes('localhost') ? 'LOCALHOST (Atenção!)' : 'Remota'}`);
  }

  let adapter;
  
  if (isProd && !connectionString?.includes('localhost')) {
    console.log("[DB] Utilizando Neon Serverless adapter (HTTP/WS)");
    const pool = new NeonPool({ 
      connectionString,
      connectionTimeoutMillis: 15000,
    });
    adapter = new PrismaNeon(pool as any);
  } else {
    console.log("[DB] Utilizando PG adapter padrão (TCP)");
    const pool = new PgPool({ 
      connectionString,
      max: isProd ? 10 : 1,
    });
    adapter = new PrismaPg(pool as any);
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
