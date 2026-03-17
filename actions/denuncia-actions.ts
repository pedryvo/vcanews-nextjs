"use server";

import { denunciaRepository } from "@/repositories/denuncia-repository";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createDenuncia(data: {
  titulo: string;
  descricao: string;
  imageUrl?: string | null;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { titulo, descricao, imageUrl } = data;
  if (!titulo?.trim() || !descricao?.trim()) {
    throw new Error("Título e descrição são obrigatórios");
  }

  const { user } = session;

  const denuncia = await denunciaRepository.create({
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    userId: user.id,
    imageUrl: imageUrl ?? null,
  });

  const isAdmin = user.role === "ADMIN";
  
  // Revalidate the denuncias page/api
  revalidatePath("/denuncias");

  return { denuncia, isAdmin };
}
