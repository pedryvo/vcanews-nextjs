import { prisma, Prisma } from "@/lib/db";

export class CidadeRepository {
  async getAll(skip?: number, take?: number) {
    return prisma.cidade.findMany({
      skip,
      take,
    });
  }

  async getAllWithBlogs() {
    return prisma.cidade.findMany({
      include: { blogs: true },
    });
  }

  async getById(id: number) {
    return prisma.cidade.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.CidadeUncheckedCreateInput) {
    return prisma.cidade.create({ data });
  }

  async update(id: number, data: Prisma.CidadeUncheckedUpdateInput) {
    return prisma.cidade.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.cidade.delete({
      where: { id },
    });
  }

  async count() {
    return prisma.cidade.count();
  }
}

export const cidadeRepository = new CidadeRepository();
