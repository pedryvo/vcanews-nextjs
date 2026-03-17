import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
        portfolio: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Remover email por privacidade
    const { email, ...publicUser } = user;

    const session = await getServerSession(authOptions as any);
    let isBlockedByMe = false;
    if (session?.user) {
      const block = await prisma.userBlock.findUnique({
        where: {
          blockerId_blockedId: {
            blockerId: (session as any).user.id,
            blockedId: user.id,
          },
        },
      });
      isBlockedByMe = !!block;
    }

    return NextResponse.json({ ...publicUser, isBlockedByMe });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
