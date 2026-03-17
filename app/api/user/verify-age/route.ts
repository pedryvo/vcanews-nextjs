import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { birthDate } = await req.json();
    if (!birthDate) {
      return NextResponse.json({ error: "Data de nascimento é obrigatória" }, { status: 400 });
    }

    const birthDateObj = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }

    if (age < 18) {
      return NextResponse.json({ 
        error: "Você deve ter pelo menos 18 anos para acessar este site." 
      }, { status: 403 });
    }

    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { birthDate: birthDateObj },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying age:", error);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
