import { NextResponse } from "next/server";
import { newsSyncService } from "@/services/news-sync-service";

import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";

async function handler() {
  try {
    console.log("--- Iniciando Sincronização via QStash ---");
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

export const POST = verifySignatureAppRouter(handler);
export const dynamic = "force-dynamic";
