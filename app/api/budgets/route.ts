import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId } = await req.json();
    const senderId = (session.user as any).id;

    if (senderId === receiverId) {
      return NextResponse.json({ error: "Você não pode pedir um orçamento para si mesmo" }, { status: 400 });
    }

    // Verificar se já existe uma conversa ABERTA entre esses dois usuários
    const existingConversation = await prisma.budgetConversation.findFirst({
      where: {
        OR: [
          { senderId, receiverId, status: "OPEN" },
          { senderId: receiverId, receiverId: senderId, status: "OPEN" },
        ],
      },
    });

    if (existingConversation) {
      return NextResponse.json({ id: existingConversation.id });
    }

    // Verificar se o destinatário bloqueou o remetente
    const isBlocked = await prisma.userBlock.findFirst({
      where: { blockerId: receiverId, blockedId: senderId },
    });

    if (isBlocked) {
      return NextResponse.json({ error: "Você foi bloqueado por este usuário" }, { status: 403 });
    }

    // Criar nova conversa
    const conversation = await prisma.budgetConversation.create({
      data: {
        senderId,
        receiverId,
        status: "OPEN",
      },
    });

    // Salvar notificação no banco para persistência
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "BUDGET_MESSAGE", // Usando o tipo existente que aponta para mensagens/id
        referenceId: conversation.id,
      }
    });

    // Notificar o destinatário via Socket
    const io = (global as any).io;
    if (io) {
      io.to(`user-${receiverId}`).emit("notification", {
        type: "NEW_BUDGET",
        referenceId: conversation.id,
        message: "Novo pedido de orçamento recebido!"
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating budget conversation:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const conversations = await prisma.budgetConversation.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, image: true, username: true } },
        receiver: { select: { id: true, name: true, image: true, username: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar conversas" }, { status: 500 });
  }
}
