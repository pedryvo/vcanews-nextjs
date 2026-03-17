import { prisma } from "@/lib/db";

export const reactionRepository = {
  async upsert(userId: string, denunciaId: string, type: "LIKE" | "UNLIKE") {
    return prisma.reaction.upsert({
      where: { userId_denunciaId: { userId, denunciaId } },
      update: { type },
      create: { userId, denunciaId, type },
    });
  },

  async remove(userId: string, denunciaId: string) {
    return prisma.reaction.deleteMany({
      where: { userId, denunciaId },
    });
  },

  async get(userId: string, denunciaId: string) {
    return prisma.reaction.findUnique({
      where: { userId_denunciaId: { userId, denunciaId } },
    });
  },
};
