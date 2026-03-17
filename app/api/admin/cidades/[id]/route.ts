import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { cidadeRepository } from "@/repositories/cidade-repository";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const cidade = await cidadeRepository.update(parseInt(id), body);
    return NextResponse.json(cidade);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao atualizar cidade" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await cidadeRepository.delete(parseInt(id));
    return NextResponse.json({ message: "Cidade deletada" });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao deletar cidade" }, { status: 500 });
  }
}
