import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions as any);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const images = await prisma.portfolioImage.findMany({
      where: {
        user: { email: session.user.email }
      },
      orderBy: { order: "asc" }
    });

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar portfólio" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions as any);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { images } = await req.json(); // Expected: Array of { url: string, order: number }

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    if (images.length > 4) {
      return NextResponse.json({ error: "Máximo de 4 imagens permitido" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Usamos uma transação para deletar as antigas e inserir as novas e manter a ordem
    await prisma.$transaction([
      prisma.portfolioImage.deleteMany({
        where: { userId: user.id }
      }),
      prisma.portfolioImage.createMany({
        data: images.map((img, index) => ({
          userId: user.id,
          url: img.url,
          order: img.order ?? index,
        }))
      })
    ]);

    const updatedPortfolio = await prisma.portfolioImage.findMany({
      where: { userId: user.id },
      orderBy: { order: "asc" }
    });

    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error("[API] Portfolio Update Error:", error);
    return NextResponse.json({ error: "Erro ao atualizar portfólio" }, { status: 500 });
  }
}
