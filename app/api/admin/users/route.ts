import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

async function getAdminSession() {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== "ADMIN") return null;
  return session;
}

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const where = {
    OR: [
      { name: { contains: q, mode: "insensitive" } as any },
      { email: { contains: q, mode: "insensitive" } as any },
      { username: { contains: q, mode: "insensitive" } as any },
    ],
  };

  const [users, total] = await Promise.all([
    (prisma as any).user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        username: true,
        createdAt: true,
        isBlocked: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    (prisma as any).user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}
