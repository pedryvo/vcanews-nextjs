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
  const isDev = process.env.NODE_ENV === "development";
  const session = isDev
    ? { user: { id: "dev-user", role: "ADMIN", name: "Dev Admin", email: "dev@dev.com" } }
    : await getServerSession(authOptions as any);

  if (!(session as any)?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { titulo, descricao, imageUrl } = await req.json();
  if (!titulo?.trim() || !descricao?.trim()) {
    return NextResponse.json({ error: "Título e descrição são obrigatórios" }, { status: 400 });
  }

  const user = (session as any).user;

  // Em dev, garante que o usuário fake existe no banco (foreign key)
  if (isDev) {
    await prisma.user.upsert({
      where: { id: "dev-user" },
      update: {},
      create: { id: "dev-user", name: "Dev Admin", email: "dev@dev.com" },
    });
  }

  const denuncia = await denunciaRepository.create({
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    userId: user.id,
    imageUrl: imageUrl ?? null,
  });

  const isAdmin = user.role === "ADMIN";
  return NextResponse.json({ denuncia, isAdmin }, { status: 201 });
}
