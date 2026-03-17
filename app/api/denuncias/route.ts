import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { denunciaRepository } from "@/repositories/denuncia-repository";
import { prisma } from "@/lib/db";

export async function GET() {
  const denuncias = await denunciaRepository.getApproved();
  const sorted = denuncias.sort((a: any, b: any) => {
    const scoreA = a.reactions.filter((r: any) => r.type === "LIKE").length - a.reactions.filter((r: any) => r.type === "UNLIKE").length;
    const scoreB = b.reactions.filter((r: any) => r.type === "LIKE").length - b.reactions.filter((r: any) => r.type === "UNLIKE").length;
    return scoreB - scoreA;
  });
  return NextResponse.json(sorted);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);

  if (!(session as any)?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { titulo, descricao, imageUrl } = await req.json();
  if (!titulo?.trim() || !descricao?.trim()) {
    return NextResponse.json({ error: "Título e descrição são obrigatórios" }, { status: 400 });
  }

  const user = (session as any).user;

  const denuncia = await denunciaRepository.create({
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    userId: user.id,
    imageUrl: imageUrl ?? null,
  });

  const isAdmin = user.role === "ADMIN";
  return NextResponse.json({ denuncia, isAdmin }, { status: 201 });
}
