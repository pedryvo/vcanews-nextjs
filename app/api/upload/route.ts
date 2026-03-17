import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  const isDev = process.env.NODE_ENV === "development";
  const session = await getServerSession(authOptions as any);

  if (!(session as any)?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string || "uploads")
    .replace(/\.\./g, "") // Prevent path traversal
    .replace(/[^\w\-/]/g, ""); // Allow only safe characters

  if (!file) {
    return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  }

  // Security Validation: Size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Arquivo muito grande (máximo 5MB)" }, { status: 400 });
  }

  // Security Validation: Types
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Apenas imagens são permitidas" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

  if (isDev) {
    // Save locally in public/uploads/[folder] for dev
    const fs = require("fs");
    const dir = join(process.cwd(), "public", "uploads", folder);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const uploadPath = join(dir, filename);
    await writeFile(uploadPath, buffer);
    return NextResponse.json({ url: `/uploads/${folder}/${filename}` });
  } else {
    // Use Vercel Blob in production
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("ERRO: BLOB_READ_WRITE_TOKEN não configurado!");
      return NextResponse.json({ error: "Configuração de upload incompleta no servidor" }, { status: 500 });
    }

    try {
      const blob = await put(`${folder}/${filename}`, buffer, {
        access: "public",
        contentType: "image/webp",
      });
      return NextResponse.json({ url: blob.url });
    } catch (error: any) {
      console.error("Erro no Vercel Blob:", error);
      return NextResponse.json({ error: "Erro ao salvar imagem no storage" }, { status: 500 });
    }
  }
}
