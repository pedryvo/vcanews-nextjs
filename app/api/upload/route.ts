import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import sharp from "sharp";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV === "development";
  const session = isDev
    ? { user: { id: "dev-user", role: "ADMIN" } }
    : await getServerSession(authOptions as any);

  if (!(session as any)?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  // Check file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Apenas imagens são aceitas" }, { status: 400 });
  }

  // Max size 10MB
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Imagem muito grande (máx 10MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Process with sharp: resize to max 800px wide, convert to WebP
  const processed = await sharp(buffer)
    .resize(800, 600, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 80 })
    .toBuffer();

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  if (isDev) {
    // Save locally in public/uploads for dev
    const uploadPath = join(process.cwd(), "public", "uploads", filename);
    await writeFile(uploadPath, processed);
    return NextResponse.json({ url: `/uploads/${filename}` });
  } else {
    // Use Vercel Blob in production
    const { put } = await import("@vercel/blob");
    const blob = await put(`denuncias/${filename}`, processed, {
      access: "public",
      contentType: "image/webp",
    });
    return NextResponse.json({ url: blob.url });
  }
}
