import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const denuncia = await prisma.denuncia.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, image: true }
        },
        reactions: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, image: true }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      }
    });

    if (!denuncia) {
      return NextResponse.json({ error: "Denúncia não encontrada" }, { status: 404 });
    }

    return NextResponse.json(denuncia);
  } catch (error) {
    console.error("Error fetching denuncia:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
