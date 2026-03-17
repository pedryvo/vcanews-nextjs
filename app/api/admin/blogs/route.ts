import { NextResponse } from "next/server";
import { blogRepository } from "@/repositories/blog-repository";

export async function GET() {
  const blogs = await blogRepository.getAll();
  return NextResponse.json(blogs);
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
