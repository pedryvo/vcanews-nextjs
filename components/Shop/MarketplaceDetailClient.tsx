"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Heart, 
  Tag, 
  Share2,
  ArrowLeft,
  Eye,
  ShoppingBag,
  Package,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MarketplaceDetailClientProps {
  initialAd: any;
}

export default function MarketplaceDetailClient({ initialAd }: MarketplaceDetailClientProps) {
  const router = useRouter();
  const [ad] = useState<any>(initialAd);
  const [sending, setSending] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { data: session } = useSession();

  const handleContact = async () => {
    if (!session) {
      toast.error("Você precisa estar logado para negociar");
      return;
    }

    try {
      setSending(true);
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          receiverId: ad.userId,
          adId: ad.id 
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/mensagens/${data.id}`);
      } else {
        const error = await res.json();
        toast.error(error.error || "Erro ao iniciar conversa");
      }
    } catch (error) {
      toast.error("Erro ao conectar com o servidor");
    } finally {
      setSending(false);
    }
  };

  const isOwner = session?.user && (session.user as any).id === ad.userId;
  const isAdmin = (session?.user as any)?.role === "ADMIN";
  const isPending = ad.status === "PENDING";
  const isRejected = ad.status === "REJECTED";

  // Se não estiver aprovado e não for o dono nem admin, não mostra
  if (ad.status !== "APPROVED" && !isOwner && !isAdmin) {
    return (
      <div className="container mx-auto py-20 px-4 text-center space-y-4">
        <div className="bg-yellow-500/10 text-yellow-600 p-10 rounded-[3rem] border-2 border-yellow-500/20 inline-block">
          <Package className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Anúncio sob moderação</h2>
          <p className="text-sm font-medium max-w-md mx-auto mt-2">Este anúncio ainda está sendo analisado pela nossa equipe e em breve estará disponível para todos.</p>
        </div>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(ad.price));

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="container mx-auto py-10 px-4 max-w-6xl">
        {/* Botão Voltar */}
        <Button variant="ghost" className="mb-6 rounded-full font-bold uppercase text-[10px] tracking-widest group" asChild>
          <Link href="/compra-e-venda">
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Voltar ao Marketplace
          </Link>
        </Button>

        {(isPending || isRejected) && isOwner && (
          <div className={cn(
            "mb-8 p-6 rounded-[2rem] border-2 flex items-center gap-6 shadow-sm",
            isPending ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200"
          )}>
             <div className={cn("p-4 rounded-2xl shadow-lg text-white", isPending ? "bg-yellow-500" : "bg-red-500")}>
               {isPending ? <Loader2 className="h-6 w-6 animate-spin" /> : <XCircle className="h-6 w-6" />}
             </div>
             <div>
               <h3 className={cn("text-sm font-black uppercase tracking-widest", isPending ? "text-yellow-900" : "text-red-900")}>
                 {isPending ? "Anúncio em Análise" : "Anúncio Reprovado"}
               </h3>
               <p className={cn("text-xs font-medium leading-tight", isPending ? "text-yellow-800" : "text-red-800")}>
                 {isPending
                   ? "Sua publicação passará por uma revisão rápida antes de ficar visível para todos."
                   : "Este anúncio não cumpre nossas diretrizes e foi removido do marketplace público."}
               </p>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Galeria de Imagens */}
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-[2.5rem] border-4 shadow-2xl bg-card relative aspect-[4/3]">
              <img
                src={ad.images[activeImage]?.url}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              {ad.images.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl shadow-xl pointer-events-auto opacity-100 transition-opacity"
                    onClick={() => setActiveImage(prev => (prev === 0 ? ad.images.length - 1 : prev - 1))}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-12 w-12 rounded-2xl shadow-xl pointer-events-auto opacity-100 transition-opacity"
                    onClick={() => setActiveImage(prev => (prev === ad.images.length - 1 ? 0 : prev + 1))}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </Card>

            <div className="grid grid-cols-3 gap-4">
              {ad.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-[4/3] rounded-2xl overflow-hidden border-4 transition-all ${
                    activeImage === i ? "border-primary shadow-lg scale-105" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Informações do Produto */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary text-primary-foreground border-none font-black text-[10px] px-3 py-1 uppercase tracking-widest">
                  {ad.subcategory.category.name}
                </Badge>
                <Badge variant="outline" className="border-2 font-bold text-[10px] px-3 py-1 uppercase tracking-widest text-muted-foreground">
                  {ad.subcategory.name}
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">
                {ad.title}
              </h1>
              <div className="text-4xl font-black text-orange-600 tracking-tighter italic">
                {formattedPrice}
              </div>
            </div>

            <Card className="p-8 rounded-[2rem] border-2 bg-background space-y-6 shadow-xl">
              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Sobre o Produto</h3>
                <p className="text-muted-foreground font-medium leading-relaxed whitespace-pre-wrap">
                  {ad.description}
                </p>
              </div>

              <div className="pt-6 border-t grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Postado em {new Date(ad.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Cód: {ad.id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">{ad.views} Visualizações</span>
                </div>
              </div>
            </Card>

            {/* Seller Contact */}
            <Card className="p-8 rounded-[2rem] border-4 border-primary/10 bg-primary/5 space-y-6 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5">
                 <ShoppingBag className="h-24 w-24" />
               </div>
               
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Vendedor Profissional</h3>
               
               <div className="flex items-center gap-4">
                 <Avatar className="h-16 w-16 border-4 border-background shadow-xl">
                    <AvatarImage src={ad.user.image} className="object-cover" />
                    <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">
                      {ad.user.name?.[0]}
                    </AvatarFallback>
                 </Avatar>
                 <div>
                   <h4 className="text-xl font-black uppercase tracking-tighter italic">{ad.user.name}</h4>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">@{ad.user.username}</p>
                 </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 pt-4">
                 {session?.user && (session as any).user.id !== ad.userId && (
                   <Button 
                     className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-3 text-base"
                     onClick={handleContact}
                     disabled={sending}
                   >
                     {sending ? (
                       <Loader2 className="h-5 w-5 animate-spin" />
                     ) : (
                       <>
                         <Mail className="h-5 w-5" /> Negociar agora
                       </>
                     )}
                   </Button>
                 )}
                 <Button 
                   variant="outline"
                   className="rounded-2xl h-14 w-full sm:w-14 border-2 shadow-sm"
                   onClick={() => {
                     navigator.clipboard.writeText(window.location.href);
                     toast.success("Link copiado!");
                   }}
                 >
                   <Share2 className="h-5 w-5" />
                 </Button>
               </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
