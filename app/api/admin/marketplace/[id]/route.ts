import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const { status } = await req.json();

    if (!["PENDING", "APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Status inválido" }, { status: 400 });
    }

    const ad = await (prisma as any).ad.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Erro ao atualizar status do anúncio:", error);
    return NextResponse.json({ error: "Erro ao atualizar anúncio" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Deletar as imagens primeiro (opcional dependendo da cascata)
    await (prisma as any).adImage.deleteMany({
      where: { adId: id }
    });

    await (prisma as any).ad.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Anúncio excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir anúncio:", error);
    return NextResponse.json({ error: "Erro ao excluir anúncio" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, price, subcategoryId, images } = body;

    // Atualizar o anúncio e suas imagens
    const ad = await (prisma as any).ad.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        subcategoryId,
        images: {
          deleteMany: {}, // Limpar as antigas e adicionar as novas (simplificado)
          create: images.map((url: string) => ({ url })),
        },
      },
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Erro ao editar anúncio:", error);
    return NextResponse.json({ error: "Erro ao editar anúncio" }, { status: 500 });
  }
}
