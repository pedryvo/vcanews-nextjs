import { prisma, Prisma } from "@/lib/db";

export class DenunciaRepository {
  async getAllApproved() {
    return prisma.denuncia.findMany({
      where: { aprovado: true },
      include: {
        user: { select: { name: true, image: true, username: true } },
        _count: { select: { comments: true, reactions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllPending() {
    return prisma.denuncia.findMany({
      where: { aprovado: false },
      include: {
        user: { select: { name: true, image: true, username: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAll(skip?: number, take?: number) {
    return prisma.denuncia.findMany({
      skip,
      take,
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { reactions: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: string) {
    return prisma.denuncia.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, image: true, username: true } },
        _count: { select: { comments: true, reactions: true } },
      },
    });
  }

  async create(data: Prisma.DenunciaUncheckedCreateInput) {
    return prisma.denuncia.create({ data });
  }

  async getLatestApproved(limit: number = 5) {
    return prisma.denuncia.findMany({
      where: { aprovado: true },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, image: true } },
      },
    });
  }

  async approve(id: string) {
    return prisma.denuncia.update({ where: { id }, data: { aprovado: true } });
  }

  async reject(id: string) {
    return prisma.denuncia.delete({ where: { id } });
  }

  async deleteById(id: string) {
    return prisma.denuncia.delete({ where: { id } });
  }

  async count() {
    return prisma.denuncia.count();
  }
}

export const denunciaRepository = new DenunciaRepository();
