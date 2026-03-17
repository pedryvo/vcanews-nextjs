import { prisma } from "@/lib/db";
import { Metadata } from "next";
import MarketplaceDetailClient from "@/components/Shop/MarketplaceDetailClient";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

async function getAd(id: string) {
  const ad = await (prisma as any).ad.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
        }
      },
      images: true,
      subcategory: {
        include: {
          category: true
        }
      }
    },
  });

  if (!ad) return null;

  // Increment views server-side
  try {
    await (prisma as any).ad.update({
      where: { id },
      data: { views: { increment: 1 } }
    });
  } catch (e) {
    console.error("Failed to increment views:", e);
  }

  return ad;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAd(id);

  if (!ad) {
    return {
      title: "Anúncio não encontrado - VCANews",
    };
  }

  const price = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(ad.price));

  const description = ad.description.length > 160 
    ? ad.description.substring(0, 157) + "..." 
    : ad.description;

  return {
    title: `${ad.title} - ${price} | Marketplace VCANews`,
    description: description,
    openGraph: {
      title: `${ad.title} por ${price}`,
      description: description,
      images: ad.images.map((img: any) => ({ url: img.url })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${ad.title} - ${price}`,
      description: description,
      images: ad.images.map((img: any) => img.url),
    },
  };
}

export default async function AdDetailPage({ params }: Props) {
  const { id } = await params;
  const ad = await getAd(id);

  if (!ad) {
    notFound();
  }

  const price = parseFloat(ad.price);
  
  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": ad.title,
    "image": ad.images.map((img: any) => img.url),
    "description": ad.description,
    "brand": {
      "@type": "Brand",
      "name": "Marketplace VCANews"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.vcanews.com.br/compra-e-venda/${ad.id}`,
      "priceCurrency": "BRL",
      "price": price,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Person",
        "name": ad.user.name
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MarketplaceDetailClient initialAd={ad} />
    </>
  );
}
