import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (status) {
    where.status = status;
  }

  try {
    const [ads, total] = await Promise.all([
      (prisma as any).ad.findMany({
        where,
        include: {
          user: {
            select: {
              name: true,
              image: true,
              username: true,
            }
          },
          images: { take: 1 },
          subcategory: {
            include: { category: true }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      (prisma as any).ad.count({ where }),
    ]);

    return NextResponse.json({
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    console.error("Erro ao buscar anúncios para admin:", error);
    return NextResponse.json({ error: "Erro ao buscar anúncios" }, { status: 500 });
  }
}
