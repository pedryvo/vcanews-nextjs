import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { denunciaRepository } from "@/repositories/denuncia-repository";

async function getAdminSession() {
  const session = await getServerSession(authOptions as any);
  if (!session || (session as any).user?.role !== "ADMIN") return null;
  return session;
}

export async function GET(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const skip = (page - 1) * limit;

  const [denuncias, total] = await Promise.all([
    denunciaRepository.getAll(skip, limit),
    denunciaRepository.count(),
  ]);

  return NextResponse.json({
    denuncias,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  });
}
