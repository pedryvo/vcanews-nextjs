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

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

const createPrismaClient = () => {
  console.log(`[DB] Inicializando Prisma. Amb: ${process.env.NODE_ENV}, Vercel: ${isVercel}, ProdMode: ${isProd}, BuildPhase: ${isBuildPhase}`);
  
  if (!connectionString) {
    console.warn("[DB] AVISO: Nenhuma string de conexão encontrada (DATABASE_URL ou NEON_DATABASE_URL).");
    if (isProd && !isBuildPhase) {
       console.error("[DB] ERRO: Conexão obrigatória em Produção fora da fase de build!");
    }
  } else {
    const masked = connectionString.replace(/:[^:@]+@/, ':***@');
    console.log(`[DB] String de conexão detectada: ${masked.includes('localhost') ? 'LOCALHOST' : 'Remota'}`);
  }

  let adapter;
  
  // Só usamos Neon Serverless se tivermos uma string de conexão e estivermos em prod/vercel
  if (isProd && connectionString && !connectionString.includes('localhost')) {
    console.log("[DB] Utilizando Neon Serverless adapter (HTTP/WS)");
    const pool = new NeonPool({ 
      connectionString,
      connectionTimeoutMillis: 15000,
    });
    adapter = new PrismaNeon(pool as any);
  } else {
    // Fallback para PG padrão (TCP) para dev local ou se a string estiver faltando no build
    console.log("[DB] Utilizando PG adapter padrão (TCP)");
    const pool = new PgPool({ 
      connectionString: connectionString || undefined,
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
