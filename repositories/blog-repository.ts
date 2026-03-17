import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";

export class BlogRepository {
  async getAll(skip?: number, take?: number) {
    return prisma.blog.findMany({
      include: { cidade: true },
      skip,
      take,
    });
  }

  async count() {
    return prisma.blog.count();
  }

  async getById(id: number) {
    return prisma.blog.findUnique({
      where: { id },
      include: { cidade: true },
    });
  }

  async create(data: Prisma.BlogUncheckedCreateInput) {
    return prisma.blog.create({ data });
  }

  async update(id: number, data: Prisma.BlogUncheckedUpdateInput) {
    return prisma.blog.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.blog.delete({
      where: { id },
    });
  }
}

export const blogRepository = new BlogRepository();
