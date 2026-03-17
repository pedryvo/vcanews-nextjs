import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { receiverId, adId } = await req.json();
    const senderId = (session?.user as any)?.id;

    if (senderId === receiverId) {
      return NextResponse.json({ error: "Você não pode pedir um orçamento para si mesmo" }, { status: 400 });
    }

    // Verificar se já existe uma conversa ABERTA entre esses dois usuários
    const existingConversation = await (prisma as any).budgetConversation.findFirst({
      where: {
        OR: [
          { senderId, receiverId, adId: adId || null, status: "OPEN" },
          { senderId: receiverId, receiverId: senderId, adId: adId || null, status: "OPEN" },
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
    const conversation = await (prisma as any).budgetConversation.create({
      data: {
        senderId,
        receiverId,
        adId: adId || null,
        status: "OPEN",
      },
    });

    // Salvar notificação no banco para persistência
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: (adId ? "MARKETPLACE_MESSAGE" : "BUDGET_MESSAGE") as any, 
        referenceId: conversation.id,
      }
    });

    // Notificar o destinatário via Pusher
    await pusherServer.trigger(`user-${receiverId}`, "notification", {
      type: adId ? "NEW_MARKETPLACE" : "NEW_BUDGET",
      referenceId: conversation.id,
      message: adId ? "Interesse em seu produto recebido!" : "Novo pedido de orçamento recebido!"
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Error creating budget conversation:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session?.user as any)?.id;

    const conversations = await (prisma as any).budgetConversation.findMany({
      where: {
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      include: {
        sender: { select: { id: true, name: true, image: true, username: true } },
        receiver: { select: { id: true, name: true, image: true, username: true } },
        ad: {
          include: {
            images: { take: 1 }
          }
        },
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
