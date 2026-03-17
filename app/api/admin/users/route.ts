import { NextResponse } from "next/server";
import { getAdminSession, unauthorizedResponse } from "@/lib/api-utils";
import { prisma, Prisma } from "@/lib/db";

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) return unauthorizedResponse();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    OR: [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { username: { contains: q, mode: "insensitive" } },
    ],
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          username: true,
          bio: true,
          professionId: true,
          createdAt: true,
          isBlocked: true,
          profession: {
            select: {
              name: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          }
        },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}
