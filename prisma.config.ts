import { defineConfig } from "prisma/config"
import fs from "node:fs"
import path from "node:path"

// Prisma 7's CLI might not load .env before evaluating this file.
// We manually load it if it's missing to avoid "DATABASE_URL is required" errors.
if (!process.env.DIRECT_URL && !process.env.NEON_DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    const envContent = fs.readFileSync(envPath, "utf-8");
    
    const directMatch = envContent.match(/^DIRECT_URL=(.*)$/m);
    if (directMatch && directMatch[1]) {
      process.env.DIRECT_URL = directMatch[1].replace(/["']/g, "").trim();
    }
    
    const neonMatch = envContent.match(/^NEON_DATABASE_URL=(.*)$/m);
    if (neonMatch && neonMatch[1]) {
      process.env.NEON_DATABASE_URL = neonMatch[1].replace(/["']/g, "").trim();
    }
  } catch (error) {
    console.warn("Note: Could not manually load .env file in prisma.config.ts (this is normal if vars are in system env)");
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Para migrações e CLI, usamos o DIRECT_URL (não-pooled) para evitar erros de advisory lock.
    url: process.env.DIRECT_URL || process.env.NEON_DATABASE_URL
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts'
  }
})