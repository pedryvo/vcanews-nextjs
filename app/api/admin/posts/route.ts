import { NextResponse } from "next/server";
import { blogPostRepository } from "@/repositories/blog-post-repository";

export async function GET() {
  const posts = await blogPostRepository.getAll();
  return NextResponse.json(posts);
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
