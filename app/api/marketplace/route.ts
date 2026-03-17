import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  const subcategoryId = searchParams.get("subcategoryId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: Record<string, any> = {};
  const userId = searchParams.get("userId");
  
  if (userId) {
    where.userId = userId;
  } else {
    where.status = "APPROVED";
  }
  
  if (subcategoryId) {
    where.subcategoryId = subcategoryId;
  } else if (categoryId) {
    where.subcategory = { categoryId };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as any).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as any).lte = parseFloat(maxPrice);
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
          images: {
            take: 1
          },
          subcategory: {
            include: {
              category: true
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
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
    console.error("Erro ao buscar anúncios:", error);
    return NextResponse.json({ error: "Erro ao buscar anúncios" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, price, subcategoryId, images } = body;

    const ad = await (prisma as any).ad.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        subcategoryId,
        userId: (session?.user as any)?.id,
        images: {
          create: images.map((url: string) => ({ url })),
        },
      },
    });

    return NextResponse.json(ad);
  } catch (error) {
    console.error("Erro ao criar anúncio:", error);
    return NextResponse.json({ error: "Erro ao criar anúncio" }, { status: 500 });
  }
}
