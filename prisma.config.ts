import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

const directUrl = env('DIRECT_URL') || env('NEON_DATABASE_URL_UNPOOLED') || env('NEON_POSTGRES_URL_NON_POOLING') || env('DATABASE_URL');

if (!directUrl) {
  console.warn("[Prisma Config] Warning: No direct connection string found. Migrations may fail.");
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: directUrl || '',
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts'
  }
})
