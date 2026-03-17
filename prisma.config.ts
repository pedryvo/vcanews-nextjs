import { defineConfig } from "prisma/config"
import fs from "node:fs"
import path from "node:path"

// Prisma 7's CLI might not load .env before evaluating this file.
// We manually load it if it's missing to avoid "DATABASE_URL is required" errors.
if (!process.env.NEON_DATABASE_URL) {
  try {
    const envPath = path.resolve(process.cwd(), ".env")
    const envContent = fs.readFileSync(envPath, "utf-8")
    const match = envContent.match(/^NEON_DATABASE_URL=(.*)$/m)
    if (match && match[1]) {
      process.env.NEON_DATABASE_URL = match[1].replace(/["']/g, "").trim()
    }
  } catch (error) {
    console.error("Warning: Could not manually load .env file in prisma.config.ts")
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.NEON_DATABASE_URL
  },
  migrations: {
    seed: 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts'
  }
})