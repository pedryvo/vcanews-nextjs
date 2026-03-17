import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { cidadeRepository } from "@/repositories/cidade-repository";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const [cidades, total] = await Promise.all([
    cidadeRepository.getAll(skip, limit),
    cidadeRepository.count(),
  ]);

  return NextResponse.json({
    cidades,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cidade = await cidadeRepository.create(body);
    return NextResponse.json(cidade);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro ao criar cidade", details: error.message }, 
      { status: 500 }
    );
  }
}
