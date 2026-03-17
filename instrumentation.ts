export async function register() {
  // O scheduler foi movido para o Vercel Cron (/api/sync)
  // para garantir estabilidade em ambiente serverless.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
     console.log('--- Instrumentation Loaded ---');
  }
}
