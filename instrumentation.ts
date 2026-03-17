export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');
    const { newsSyncService } = await import('@/services/news-sync-service');

    console.log('--- Registrando Scheduler de Notícias ---');
    
    // Roda a cada minuto
    cron.schedule('* * * * *', async () => {
      console.log('--- Iniciando Sincronização Automática ---');
      try {
        await newsSyncService.sync();
        console.log('--- Sincronização Automática Concluída ---');
      } catch (error) {
        console.error('--- Erro na Sincronização Automática:', error);
      }
    });

    // Sincronização inicial ao subir o servidor (opcional, mas bom pra teste)
    console.log('--- Executando Sincronização Inicial ---');
    newsSyncService.sync().catch(console.error);
  }
}
