import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const blogCount = await prisma.blog.count();
    const cityCount = await prisma.cidade.count();
    return NextResponse.json({ blogs: blogCount, cities: cityCount });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
