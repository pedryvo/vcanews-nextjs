import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session as any).user.id;

    const existingBlock = await prisma.userBlock.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId: userId,
          blockedId: id,
        },
      },
    });

    if (existingBlock) {
      await prisma.userBlock.delete({
        where: { id: existingBlock.id },
      });
      return NextResponse.json({ success: true, action: "unblocked" });
    } else {
      await prisma.userBlock.create({
        data: {
          blockerId: userId,
          blockedId: id,
        },
      });
      return NextResponse.json({ success: true, action: "blocked" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error blocking user:", error);
    return NextResponse.json({ error: "Erro ao bloquear usuário" }, { status: 500 });
  }
}
