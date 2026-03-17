import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content } = await req.json();
    const userId = (session?.user as any)?.id;

    // Verificar se a conversa existe e se o usuário faz parte dela
    const conversation = await (prisma as any).budgetConversation.findUnique({
      where: { id },
    });

    if (!conversation) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    if (conversation.senderId !== userId && conversation.receiverId !== userId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    if (conversation.status === "FINISHED") {
      return NextResponse.json({ error: "Esta conversa já foi encerrada" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        conversationId: id,
        senderId: userId,
        content,
      },
    });

    // Atualizar lastMessageAt na conversa
    await (prisma as any).budgetConversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    });

    // Criar notificação para o outro usuário
    const otherUserId = conversation.senderId === userId ? conversation.receiverId : conversation.senderId;
    const notificationType = (conversation.adId ? "MARKETPLACE_MESSAGE" : "BUDGET_MESSAGE") as any;
    
    await prisma.notification.create({
      data: {
        userId: otherUserId,
        type: notificationType,
        referenceId: id,
      },
    });

    // Notificar via Pusher (Sino + Chat)
    // Para o chat aberto
    await pusherServer.trigger(id, "new-message", message);
    
    // Para o sino (ponto vermelho)
    await pusherServer.trigger(`user-${otherUserId}`, "notification", {
      type: conversation.adId ? "MARKETPLACE_MESSAGE" : "BUDGET_MESSAGE",
      referenceId: id,
      message: conversation.adId ? "Nova mensagem na negociação do produto" : "Nova mensagem no chat de orçamento"
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session?.user as any)?.id;

    const conversation = await (prisma as any).budgetConversation.findUnique({
      where: { id },
      include: {
            messages: {
              orderBy: { createdAt: "asc" },
            },
            sender: { select: { id: true, name: true, image: true, username: true } },
            receiver: { select: { id: true, name: true, image: true, username: true } },
            ad: {
              include: {
                images: { take: 1 }
              }
            },
          },
        });

    if (!conversation) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    if (conversation.senderId !== userId && conversation.receiverId !== userId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar detalhes da conversa" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session?.user as any)?.id;
    const { status } = await req.json();

    const conversation = await (prisma as any).budgetConversation.findUnique({
      where: { id },
    });

    if (!conversation) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    if (conversation.senderId !== userId && conversation.receiverId !== userId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const updated = await (prisma as any).budgetConversation.update({
      where: { id },
      data: { status },
    });

    // Notificar mudança de status via Pusher
    await pusherServer.trigger(id, "conversation-status-updated", {
      conversationId: id,
      status,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar conversa" }, { status: 500 });
  }
}
