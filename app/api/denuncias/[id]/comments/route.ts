import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { commentRepository } from "@/repositories/comment-repository";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comments = await commentRepository.getByDenunciaId(id);
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar comentários" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions as any);

  if (!(session as any)?.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { text } = await req.json();
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Comentário não pode estar vazio" }, { status: 400 });
    }

    const comment = await commentRepository.create({
      text,
      userId: ((session as any).user as any).id,
      denunciaId: id,
    });

    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao salvar comentário" }, { status: 500 });
  }
}
