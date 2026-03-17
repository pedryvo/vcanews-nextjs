import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class CidadeRepository {
  async getAll(skip?: number, take?: number) {
    return prisma.cidade.findMany({
      skip,
      take,
      orderBy: { nome: "asc" },
    });
  }

  async count() {
    return prisma.cidade.count();
  }

  async getById(id: number) {
    return prisma.cidade.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.CidadeCreateInput) {
    return prisma.cidade.create({ data });
  }

  async update(id: number, data: Prisma.CidadeUpdateInput) {
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
}

export const cidadeRepository = new CidadeRepository();
