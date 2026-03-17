import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { commentRepository } from "@/repositories/comment-repository";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions as any);

  if ((session as any)?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  try {
    const [comments, total] = await Promise.all([
      commentRepository.getAll(skip, limit),
      commentRepository.count(),
    ]);

    return NextResponse.json({
      comments,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("[ADMIN_COMMENTS_GET]", error);
    return NextResponse.json({ error: "Erro ao buscar comentários" }, { status: 500 });
  }
}
