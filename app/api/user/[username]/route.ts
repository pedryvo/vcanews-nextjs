import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profession: {
          include: {
            category: true,
          },
        },
        denuncias: {
          where: { aprovado: true },
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Remover email por privacidade
    const { email, ...publicUser } = user;
    return NextResponse.json(publicUser);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
