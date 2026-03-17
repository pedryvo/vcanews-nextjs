import { NextResponse } from "next/server";
import { blogPostRepository } from "@/repositories/blog-post-repository";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const post = await blogPostRepository.update(parseInt(params.id), body);
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await blogPostRepository.delete(parseInt(params.id));
    return NextResponse.json({ message: "Post deletado" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar post" }, { status: 500 });
  }
}
