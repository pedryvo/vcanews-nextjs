import { NextRequest, NextResponse } from "next/server";
import { blogPostRepository } from "@/repositories/blog-post-repository";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const post = await blogPostRepository.update(parseInt(id), body);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar post" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await blogPostRepository.delete(parseInt(id));
    return NextResponse.json({ message: "Post deletado" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar post" }, { status: 500 });
  }
}
