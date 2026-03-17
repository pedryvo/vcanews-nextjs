import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/db";

export class UserRepository {
  async getByEmail(email: string, include?: Prisma.UserInclude) {
    return prisma.user.findUnique({
      where: { email },
      include,
    });
  }

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async getProfileStatus(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: { 
        professionId: true, 
        username: true,
        role: true 
      }
    });
  }

  async update(email: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { email },
      data,
    });
  }

  async count() {
    return prisma.user.count();
  }
}

export const userRepository = new UserRepository();
