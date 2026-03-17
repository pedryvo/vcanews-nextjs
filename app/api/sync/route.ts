import { NextResponse } from "next/server";
import { newsSyncService } from "@/services/news-sync-service";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await newsSyncService.sync();
    return NextResponse.json({ message: "Sincronização concluída com sucesso!" });
  } catch (error) {
    console.error("Erro na API de sync:", error);
    return NextResponse.json(
      { error: "Erro ao sincronizar notícias." },
      { status: 500 }
    );
  }
}
