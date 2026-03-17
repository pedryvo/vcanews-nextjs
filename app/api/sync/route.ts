import { NextResponse } from "next/server";
import { newsSyncService } from "@/services/news-sync-service";

export async function GET() {
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
