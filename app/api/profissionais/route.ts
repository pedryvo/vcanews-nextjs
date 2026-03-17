import { NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const categoryId = searchParams.get("categoryId");
    const professionId = searchParams.get("professionId");

    const where: Prisma.UserWhereInput = {
      professionId: { not: null },
      AND: [
        {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
            { profession: { name: { contains: query, mode: "insensitive" } } },
          ],
        }
      ]
    };

    if (professionId && professionId !== "all") {
      where.professionId = professionId;
    } else if (categoryId && categoryId !== "all") {
      where.profession = { categoryId };
    }

    const professionals = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        coverImage: true,
        bio: true,
        profession: {
          select: {
            name: true,
            category: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(professionals);
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return NextResponse.json({ error: "Erro ao buscar profissionais" }, { status: 500 });
  }
}

