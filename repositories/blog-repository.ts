import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class BlogRepository {
  async getAll() {
    return prisma.blog.findMany({
      include: { cidade: true },
    });
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
