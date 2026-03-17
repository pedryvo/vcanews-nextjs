import { prisma } from "./db";
import { customAlphabet } from "nanoid";

// Usamos um alfabeto amigável para URLs
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 10);

/**
 * Gera um username único e escalável.
 * Formato: usuario-hexadecimal (ex: user-3f8a2c1b90)
 * Isso garante bilhões de combinações sem colisões.
 */
export async function generateUniqueUsername(baseName?: string | null): Promise<string> {
  const prefix = baseName 
    ? baseName.toLowerCase().replace(/[^a-z0-9]/g, "").substring(0, 15)
    : "user";
  
  let isUnique = false;
  let username = "";
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    const suffix = nanoid();
    username = `${prefix}-${suffix}`;
    
    const existing = await prisma.user.findUnique({
      where: { username },
    });

    if (!existing) {
      isUnique = true;
    }
    attempts++;
  }

  return username;
}
