import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { blogPostRepository } from "@/repositories/blog-post-repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    blogPostRepository.getAll(skip, limit),
    blogPostRepository.count(),
  ]);

  return NextResponse.json({
    posts,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await blogPostRepository.create(body);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar post" }, { status: 500 });
  }
}
