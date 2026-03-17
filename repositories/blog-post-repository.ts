import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export class BlogPostRepository {
  async getLatest(take: number = 12) {
    return prisma.blogPost.findMany({
      orderBy: { dataPublicacao: "desc" },
      include: { blog: true },
      take,
    });
  }

  async getPaged(take: number, skip: number) {
    return prisma.blogPost.findMany({
      orderBy: { dataPublicacao: "desc" },
      include: { blog: true },
      take,
      skip,
    });
  }

  async existsByUrl(url: string) {
    const count = await prisma.blogPost.count({
      where: { url },
    });
    return count > 0;
  }

  async getAll() {
    return prisma.blogPost.findMany({
      orderBy: { dataPublicacao: "desc" },
      include: { blog: true },
    });
  }

  async getById(id: number) {
    return prisma.blogPost.findUnique({
      where: { id },
      include: { blog: true },
    });
  }

  async upsert(data: Prisma.BlogPostUpsertArgs) {
    return prisma.blogPost.upsert(data);
  }

  async create(data: Prisma.BlogPostUncheckedCreateInput) {
    return prisma.blogPost.create({ data });
  }

  async update(id: number, data: Prisma.BlogPostUncheckedUpdateInput) {
    return prisma.blogPost.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.blogPost.delete({
      where: { id },
    });
  }
}

export const blogPostRepository = new BlogPostRepository();
