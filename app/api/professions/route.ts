import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const categories = await prisma.professionCategory.findMany({
      include: {
        professions: {
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[API] Error fetching professions:", error);
    return NextResponse.json(
      { error: "Erro ao carregar profissões" },
      { status: 500 }
    );
  }
}
