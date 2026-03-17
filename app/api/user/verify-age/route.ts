import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { birthDate } = await req.json();
    if (!birthDate) {
      return NextResponse.json({ error: "Data de nascimento é obrigatória" }, { status: 400 });
    }

    const dateOfBirth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const m = today.getMonth() - dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }

    if (age < 18) {
      return NextResponse.json({ error: "Você deve ter pelo menos 18 anos" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { birthDate: dateOfBirth },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify age error:", error);
    return NextResponse.json({ error: "Erro ao verificar idade" }, { status: 500 });
  }
}
