import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as any);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { content } = await req.json();
    const userId = (session.user as any).id;

    // Verificar se a conversa existe e se o usuário faz parte dela
    const conversation = await prisma.budgetConversation.findUnique({
      where: { id },
      include: {
        sender: true,
        receiver: true,
      },
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
    await prisma.budgetConversation.update({
      where: { id },
      data: { lastMessageAt: new Date() },
    });

    // Criar notificação para o outro usuário
    const otherUserId = conversation.senderId === userId ? conversation.receiverId : conversation.senderId;
    await prisma.notification.create({
      data: {
        userId: otherUserId,
        type: "BUDGET_MESSAGE",
        referenceId: id,
      },
    });

    // Notificar via Socket (Sino + Chat)
    const io = (global as any).io;
    if (io) {
      // Para o chat aberto
      io.to(id).emit("new-message", message);
      // Para o sino (ponto vermelho)
      io.to(`user-${otherUserId}`).emit("notification", {
        type: "BUDGET_MESSAGE",
        referenceId: id,
        message: "Nova mensagem no chat de orçamento"
      });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Erro ao enviar mensagem" }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions as any);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;

    const conversation = await prisma.budgetConversation.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        sender: { select: { id: true, name: true, image: true, username: true } },
        receiver: { select: { id: true, name: true, image: true, username: true } },
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
    const session = await getServerSession(authOptions as any);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const { status } = await req.json();

    const conversation = await prisma.budgetConversation.findUnique({
      where: { id },
    });

    if (!conversation) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });
    if (conversation.senderId !== userId && conversation.receiverId !== userId) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const updated = await prisma.budgetConversation.update({
      where: { id },
      data: { status },
    });

    // Notificar mudança de status via Socket
    const io = (global as any).io;
    if (io) {
      io.to(id).emit("conversation-status-updated", {
        conversationId: id,
        status,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar conversa" }, { status: 500 });
  }
}
