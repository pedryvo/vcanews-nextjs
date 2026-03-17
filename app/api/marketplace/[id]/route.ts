import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { title, description, price, subcategoryId, images } = body;

    // Check ownership
    const existingAd = await (prisma as any).ad.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingAd || existingAd.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ad = await (prisma as any).ad.update({
      where: { id },
      data: {
        title,
        description,
        price: parseFloat(price),
        subcategoryId,
        status: "PENDING", // Reset to pending for re-moderation
        images: {
          deleteMany: {},
          create: images.map((url: string) => ({ url })),
        },
      },
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Erro ao atualizar anúncio:", error);
    return NextResponse.json({ error: "Erro ao atualizar anúncio" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check ownership
    const existingAd = await (prisma as any).ad.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingAd || existingAd.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    // Only allow status updates
    if (!status || !["SOLD", "APPROVED", "PENDING", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check ownership
    const existingAd = await (prisma as any).ad.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!existingAd || existingAd.userId !== (session.user as any).id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ad = await (prisma as any).ad.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Erro ao atualizar status do anúncio:", error);
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 500 });
  }
}
