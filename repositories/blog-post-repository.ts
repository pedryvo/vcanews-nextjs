import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";

export class BlogPostRepository {
  async count() {
    return prisma.blogPost.count();
  }

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

  async getAll(skip?: number, take?: number) {
    return prisma.blogPost.findMany({
      include: {
        blog: {
          include: { cidade: true },
        },
      },
      orderBy: { dataPublicacao: "desc" },
      skip,
      take,
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

  async deleteDuplicates() {
    // This finding logic is useful if the @unique constraint wasn't always there 
    // or if we want to be absolutely sure.
    const duplicates = await prisma.$queryRaw<{ url: string }[]>`
      SELECT url FROM "BlogPost"
      GROUP BY url
      HAVING COUNT(*) > 1
    `;
    if (duplicates.length === 0) return 0;

    let deletedCount = 0;
    for (const dup of duplicates) {
      const posts = await prisma.blogPost.findMany({
        where: { url: dup.url },
        orderBy: { createdAt: "asc" },
      });

      // Keep the first one, delete the rest
      const [keep, ...remove] = posts;
      for (const toRemove of remove) {
        await prisma.blogPost.delete({ where: { id: toRemove.id } });
        deletedCount++;
      }
    }

    return deletedCount;
  }
}

export const blogPostRepository = new BlogPostRepository();
