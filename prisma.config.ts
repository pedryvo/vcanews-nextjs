import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DIRECT_URL') || env('NEON_DATABASE_URL_UNPOOLED') || env('NEON_POSTGRES_URL_NON_POOLING') || env('DATABASE_URL'),
  },
  migrations: {
    seed: 'npx tsx prisma/seed.ts'
  }
})
