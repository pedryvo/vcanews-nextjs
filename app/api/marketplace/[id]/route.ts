import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Increment views
    await (prisma as any).ad.update({
      where: { id },
      data: { views: { increment: 1 } }
    });

    const ad = await (prisma as any).ad.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
            email: true,
          }
        },
        images: true,
        subcategory: {
          include: {
            category: true
          }
        }
      },
    });

    if (!ad) {
      return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
    }

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Erro ao buscar anúncio:", error);
    return NextResponse.json({ error: "Erro ao buscar anúncio" }, { status: 500 });
  }
}
