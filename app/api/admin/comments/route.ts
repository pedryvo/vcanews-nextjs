import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { commentRepository } from "@/repositories/comment-repository";

export async function GET() {
  const isDev = process.env.NODE_ENV === "development";
  const session = isDev
    ? { user: { id: "dev-user", role: "ADMIN", name: "Dev Admin" } }
    : await getServerSession(authOptions as any);

  if ((session as any)?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  try {
    const comments = await commentRepository.getAll();
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar comentários" }, { status: 500 });
  }
}
