import { NextResponse } from "next/server";
import { blogRepository } from "@/repositories/blog-repository";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const blog = await blogRepository.update(parseInt(params.id), body);
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar blog" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await blogRepository.delete(parseInt(params.id));
    return NextResponse.json({ message: "Blog deletado" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar blog" }, { status: 500 });
  }
}
