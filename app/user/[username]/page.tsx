import { prisma } from "@/lib/db";
import { Metadata } from "next";
import PublicProfileClient from "@/components/User/PublicProfileClient";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Props {
  params: Promise<{ username: string }>;
}

async function getUser(username: string) {
  const session = await getServerSession(authOptions as any) as any;
  const currentUserId = session?.user?.id;

  const user = await (prisma as any).user.findUnique({
    where: { username },
    include: {
      profession: {
        include: {
          category: true
        }
      },
      portfolio: true,
    }
  });

  if (!user) return null;

  // Check if blocked by current user
  let isBlockedByMe = false;
  if (currentUserId) {
    const block = await (prisma as any).block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: user.id
      }
    });
    isBlockedByMe = !!block;
  }

  return { ...user, isBlockedByMe };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    return {
      title: "Usuário não encontrado - VCANews",
    };
  }

  const profession = user.profession?.name ? ` | ${user.profession.name}` : "";
  const bio = user.bio ? (user.bio.length > 160 ? user.bio.substring(0, 157) + "..." : user.bio) : "Conheça o perfil profissional no VCANews.";

  return {
    title: `${user.name}${profession} em Vitória da Conquista - VCANews`,
    description: bio,
    openGraph: {
      title: `${user.name}${profession}`,
      description: bio,
      images: user.image ? [{ url: user.image }] : [{ url: "/og-image.png" }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name}${profession}`,
      description: bio,
      images: user.image ? [user.image] : ["/og-image.png"],
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;
  const user = await getUser(username);

  if (!user) {
    notFound();
  }

  return <PublicProfileClient initialUser={user} />;
}
