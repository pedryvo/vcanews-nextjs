import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { blogRepository } from "@/repositories/blog-repository";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const blog = await blogRepository.update(parseInt(id), body);
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar blog" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await blogRepository.delete(parseInt(id));
    return NextResponse.json({ message: "Blog deletado" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar blog" }, { status: 500 });
  }
}
