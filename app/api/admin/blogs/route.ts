import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { blogRepository } from "@/repositories/blog-repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const [blogs, total] = await Promise.all([
    blogRepository.getAll(skip, limit),
    blogRepository.count(),
  ]);

  return NextResponse.json({
    blogs,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const blog = await blogRepository.create(body);
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar blog" }, { status: 500 });
  }
}
