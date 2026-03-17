import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { denunciaRepository } from "@/repositories/denuncia-repository";

async function getAdminSession() {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== "ADMIN") return null;
  return session;
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { action } = await req.json(); // "approve" or "reject"

  if (action === "approve") {
    await denunciaRepository.approve(id);
    return NextResponse.json({ success: true, action: "approved" });
  } else if (action === "reject") {
    await denunciaRepository.reject(id);
    return NextResponse.json({ success: true, action: "rejected" });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
