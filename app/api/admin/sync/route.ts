import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { newsSyncService } from "@/services/news-sync-service";

export async function POST() {
  const session = await getServerSession(authOptions as any);

  if (!(session as any) || (session as any).user.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log(`[SYNC] Sincronização manual iniciada por: ${(session as any).user.email}`);
    await newsSyncService.sync();
    return NextResponse.json({ message: "Sincronização concluída com sucesso!" });
  } catch (error) {
    console.error("Erro na sincronização manual:", error);
    return NextResponse.json(
      { error: "Erro ao sincronizar notícias." },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
