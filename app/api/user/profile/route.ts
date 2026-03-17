import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions as any);

  if (!(session as any)?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const user = await (prisma as any).user.findUnique({
      where: { email: (session as any).user.email },
      include: {
        profession: {
          include: {
            category: true,
          },
        },
        portfolio: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Filtramos o email por segurança conforme pedido
    const { email, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions as any);

  if (!(session as any)?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, bio, image, coverImage, professionId, username } = body;

    // Validação de limite de bio
    if (bio && bio.length > 3000) {
      return NextResponse.json({ error: "Bio muito longa. Máximo 3000 caracteres." }, { status: 400 });
    }

    // Validação básica de username se fornecido
    if (username) {
      const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, "");
      
      const existing = await prisma.user.findFirst({
        where: {
          username: cleanUsername,
          NOT: { email: (session as any).user.email },
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Nome de usuário já está em uso" }, { status: 400 });
      }
    }

    const updatedUser = await (prisma as any).user.update({
      where: { email: (session as any).user.email },
      data: {
        name: name || undefined,
        bio: bio !== undefined ? bio : undefined,
        image: image || undefined,
        coverImage: coverImage !== undefined ? coverImage : undefined,
        professionId: professionId !== undefined ? professionId : undefined,
        username: username ? username.toLowerCase().replace(/[^a-z0-9]/g, "") : undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[API] Profile Update Error:", error);
    return NextResponse.json({ error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}
