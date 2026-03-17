import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { denunciaRepository } from "@/repositories/denuncia-repository";
import { Prisma } from "@/lib/db";

type DenunciaWithReactions = Prisma.DenunciaGetPayload<{
  include: {
    user: { select: { name: true; image: true; username: true } };
    reactions: true;
    _count: { select: { comments: true; reactions: true } };
  };
}>;

export async function GET() {
  const denuncias = await denunciaRepository.getAllApproved() as unknown as DenunciaWithReactions[];
  
  const sorted = [...denuncias].sort((a, b) => {
    const scoreA = (a.reactions?.filter((r) => r.type === "LIKE").length || 0) - 
                   (a.reactions?.filter((r) => r.type === "UNLIKE").length || 0);
    const scoreB = (b.reactions?.filter((r) => r.type === "LIKE").length || 0) - 
                   (b.reactions?.filter((r) => r.type === "UNLIKE").length || 0);
    return scoreB - scoreA;
  });
  
  return NextResponse.json(sorted);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { titulo, descricao, imageUrl } = await req.json();
    if (!titulo?.trim() || !descricao?.trim()) {
      return NextResponse.json({ error: "Título e descrição são obrigatórios" }, { status: 400 });
    }

    const { user } = session;

    const denuncia = await denunciaRepository.create({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      userId: user.id,
      imageUrl: imageUrl ?? null,
    });

    const isAdmin = user.role === "ADMIN";
    return NextResponse.json({ denuncia, isAdmin }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar denúncia" }, { status: 500 });
  }
}

