import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { reactionRepository } from "@/repositories/reaction-repository";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: denunciaId } = await params;
  const session = await getServerSession(authOptions as any);

  if (!(session as any)?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type } = await req.json(); // "LIKE", "UNLIKE", or null (remove)
  const userId = (session as any).user.id;

  if (!type) {
    await reactionRepository.remove(userId, denunciaId);
    return NextResponse.json({ success: true, action: "removed" });
  }

  if (type !== "LIKE" && type !== "UNLIKE") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const reaction = await reactionRepository.upsert(userId, denunciaId, type);
  return NextResponse.json({ success: true, reaction });
}
