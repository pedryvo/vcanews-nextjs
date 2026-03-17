import { prisma } from "@/lib/db";

export const commentRepository = {
  async create(data: { text: string; userId: string; denunciaId: string }) {
    return prisma.comment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
  },

  async getByDenunciaId(denunciaId: string) {
    return prisma.comment.findMany({
      where: { denunciaId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async getAll(skip?: number, take?: number) {
    return prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        denuncia: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take,
    });
  },

  async count() {
    return prisma.comment.count();
  },

  async delete(id: string) {
    return prisma.comment.delete({
      where: { id },
    });
  },
};
