import { prisma } from "@/lib/db";

export const denunciaRepository = {
  async create(data: { titulo: string; descricao: string; userId: string; imageUrl?: string | null }) {
    return prisma.denuncia.create({ data });
  },

  async getApproved() {
    return prisma.denuncia.findMany({
      where: { aprovado: true },
      include: {
        user: { select: { id: true, name: true, image: true } },
        reactions: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getPending() {
    return prisma.denuncia.findMany({
      where: { aprovado: false },
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { reactions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async approve(id: string) {
    return prisma.denuncia.update({ where: { id }, data: { aprovado: true } });
  },

  async reject(id: string) {
    return prisma.denuncia.delete({ where: { id } });
  },

  async deleteById(id: string) {
    return prisma.denuncia.delete({ where: { id } });
  },

  async getAll() {
    return prisma.denuncia.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { reactions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};
