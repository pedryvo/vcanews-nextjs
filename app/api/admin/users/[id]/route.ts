import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function getAdminSession() {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { role, isBlocked, name, username, bio, professionId } = await req.json();
    
    const data: any = {};
    if (role && ["USER", "ADMIN"].includes(role)) data.role = role;
    if (typeof isBlocked === "boolean") data.isBlocked = isBlocked;
    if (typeof name === "string") data.name = name;
    if (typeof username === "string") data.username = username;
    if (typeof bio === "string") data.bio = bio;
    if (typeof professionId === "string" || professionId === null) data.professionId = professionId;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nenhum dado para atualizar" }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar usuário" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Impedir que um admin delete a si mesmo
    if ((session as any).user?.id === id) {
      return NextResponse.json({ error: "Você não pode deletar sua própria conta" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}
