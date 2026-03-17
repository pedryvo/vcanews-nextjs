import { NextResponse } from "next/server";
import { cidadeRepository } from "@/repositories/cidade-repository";

export async function GET() {
  const cidades = await cidadeRepository.getAll();
  return NextResponse.json(cidades);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cidade = await cidadeRepository.create(body);
    return NextResponse.json(cidade);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao criar cidade" }, { status: 500 });
  }
}
