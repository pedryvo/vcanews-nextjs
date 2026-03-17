import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { cidadeRepository } from "@/repositories/cidade-repository";

export async function GET() {
  const cidades = await cidadeRepository.getAll();
  return NextResponse.json(cidades);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("POST /api/admin/cidades - Body:", body);
    
    if (!process.env.DATABASE_URL) {
      console.error("DATABASE_URL is missing in environment!");
    }

    const cidade = await cidadeRepository.create(body);
    return NextResponse.json(cidade);
  } catch (error: any) {
    console.error("Error creating city:", error);
    return NextResponse.json(
      { error: "Erro ao criar cidade", details: error.message }, 
      { status: 500 }
    );
  }
}
