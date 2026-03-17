import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session as any).user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false },
    });

    // Agrupar notificações e buscar dados extras
    const aggregated = [];
    const processedGroups = new Set();

    for (const n of notifications) {
      if (n.type === "BUDGET_MESSAGE" || n.type === "NEW_BUDGET" || n.type === "MARKETPLACE_MESSAGE") {
        if (processedGroups.has(n.referenceId)) continue;
        processedGroups.add(n.referenceId);

        const conversation = await prisma.budgetConversation.findUnique({
          where: { id: n.referenceId },
          include: {
            sender: { select: { id: true, name: true, image: true } },
            receiver: { select: { id: true, name: true, image: true } },
          },
        });

        if (conversation) {
          const otherUser = conversation.senderId === userId ? conversation.receiver : conversation.sender;
          const count = notifications.filter(
            x => x.referenceId === n.referenceId && !x.read
          ).length;

          aggregated.push({
            ...n,
            otherUser,
            unreadCount: count,
            status: conversation.status,
          });
        }
      } else if (n.type === "COMMENT") {
        if (processedGroups.has(n.referenceId)) continue;
        processedGroups.add(n.referenceId);

        const count = notifications.filter(
          x => x.referenceId === n.referenceId && !x.read
        ).length;

        // Buscar o último comentário para saber quem mandou
        const latestComment = await prisma.comment.findFirst({
          where: { denunciaId: n.referenceId },
          orderBy: { createdAt: "desc" },
          include: { user: { select: { id: true, name: true, image: true } } }
        });

        aggregated.push({
          ...n,
          otherUser: latestComment?.user,
          unreadCount: count,
          status: "OPEN"
        });
      } else {
        aggregated.push({ ...n, unreadCount: n.read ? 0 : 1 });
      }
    }

    return NextResponse.json({ notifications: aggregated, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar notificações" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session as any).user.id;

    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar notificações" }, { status: 500 });
  }
}
