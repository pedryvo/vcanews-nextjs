import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { userRepository } from "@/repositories/user-repository";
import { errorResponse, unauthorizedResponse } from "@/lib/api-utils";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return unauthorizedResponse();
  }

  try {
    const user = await userRepository.getByEmail(session.user.email, {
      profession: {
        include: {
          category: true,
        },
      },
      portfolio: true,
    });

    if (!user) {
      return errorResponse("Usuário não encontrado", 404);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return errorResponse("Erro ao buscar perfil");
  }
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return unauthorizedResponse();
  }

  try {
    const data = await req.json();
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        bio: data.bio,
        professionId: data.professionId,
        username: data.username,
        image: data.image,
        coverImage: data.coverImage,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error.code === "P2002") {
      return errorResponse("Este nome de usuário já está em uso.", 400);
    }
    return errorResponse("Erro ao atualizar perfil");
  }
}
