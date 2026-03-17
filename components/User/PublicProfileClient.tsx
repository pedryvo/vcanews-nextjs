"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User as UserIcon, 
  MapPin, 
  Calendar, 
  Briefcase, 
  AlertTriangle,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Slash,
  ChevronRight,
  ChevronLeft,
  ShieldAlert
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdCard } from "@/components/Shop/AdCard";
import { AdForm } from "@/components/Shop/AdForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, ShoppingBag } from "lucide-react";

interface PublicProfileClientProps {
  initialUser: any;
}

export default function PublicProfileClient({ initialUser }: PublicProfileClientProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(initialUser);
  const [startingBudget, setStartingBudget] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [userAds, setUserAds] = useState<any[]>([]);
  const [adFormOpen, setAdFormOpen] = useState(false);
  const [loadingAds, setLoadingAds] = useState(false);
  const [adPage, setAdPage] = useState(1);
  const [adPagination, setAdPagination] = useState<any>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserAds();
    }
  }, [user?.id, adPage]);

  const fetchUserAds = async () => {
    setLoadingAds(true);
    try {
      const res = await fetch(`/api/marketplace?userId=${user.id}&page=${adPage}&limit=6`);
      if (res.ok) {
        const data = await res.json();
        setUserAds(data.ads);
        setAdPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch user ads");
    } finally {
      setLoadingAds(false);
    }
  };

  const handleAdPageChange = (newPage: number) => {
    setAdPage(newPage);
  };

  const handleStartBudget = async () => {
    if (!session) {
      toast.error("Você precisa estar logado para fazer um orçamento.");
      return;
    }
    
    setStartingBudget(true);
    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: user.id }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/mensagens/${data.id}`);
      } else {
        toast.error(data.error || "Erro ao iniciar conversa");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setStartingBudget(false);
    }
  };

  const handleBlockUser = async () => {
    if (!session) return;
    try {
      const res = await fetch(`/api/user/block/${user.id}`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        const action = data.action === "blocked" ? "bloqueado" : "desbloqueado";
        toast.success(`Usuário ${action} com sucesso.`);
        
        // Atualizar estado local
        setUser((prev: any) => ({ ...prev, isBlockedByMe: data.action === "blocked" }));
        
        if (data.action === "blocked") {
          router.push("/");
        }
      } else {
        toast.error("Erro ao processar bloqueio");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    }
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setActiveSlide(prev => (prev === user.portfolio.length - 1 ? 0 : prev + 1));
    } else if (isRightSwipe) {
      setActiveSlide(prev => (prev === 0 ? user.portfolio.length - 1 : prev - 1));
    }
  };

  const isOwnProfile = (session?.user as any)?.id === user.id;

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header do Perfil / Capa Premium */}
      <div className="h-40 md:h-80 relative overflow-hidden bg-muted group">
        {user.coverImage ? (
          <img 
            src={user.coverImage} 
            alt="Capa do Perfil" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>
      
      <div className="container max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end gap-6 relative z-10 pb-6">
          <div className="-mt-20 md:-mt-32">
            <Avatar className="w-40 h-40 md:w-56 md:h-56 border-8 border-background shadow-2xl rounded-full">
              <AvatarImage src={user.image || ""} className="object-cover" />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-black">
                {user.name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 space-y-2 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase break-words">
                {user.name}
              </h1>
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-xs font-mono lowercase">
                @{user.username}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-medium">
              {user.profession && (
                <div className="flex items-center gap-1.5 text-foreground">
                  <Briefcase className="h-4 w-4 text-primary" />
                  {user.profession.name}
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR", { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>

          {!isOwnProfile && session && (
            <div className="flex flex-wrap items-center gap-2 pt-4 md:pt-0">
              <Button 
                onClick={handleStartBudget} 
                disabled={startingBudget}
                className="rounded-2xl h-12 px-6 font-bold uppercase tracking-wider shadow-lg shadow-primary/20"
              >
                {startingBudget ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
                Faça um Orçamento
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBlockUser}
                className={cn(
                  "h-12 rounded-2xl border-2 font-bold uppercase tracking-wider px-6 transition-all",
                  user.isBlockedByMe 
                    ? "bg-green-50 border-green-200 text-green-600 hover:bg-green-100" 
                    : "border-destructive/20 text-destructive hover:bg-destructive/10"
                )}
              >
                <Slash className="mr-2 h-4 w-4" />
                {user.isBlockedByMe ? "Desbloquear" : "Bloquear"}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
              <div className="h-1.5 w-full bg-primary" />
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <UserIcon className="h-4 w-4 text-primary" /> Sobre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.bio ? (
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap text-justify break-words overflow-hidden">
                    {user.bio}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground opacity-50 italic">
                    Nenhuma biografia disponível.
                  </p>
                )}
                
                {user.profession?.category && (
                  <div className="pt-4 border-t space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expertise em</span>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-2xl border">
                      <span className="text-xs font-bold">{user.profession.category.name}</span>
                      <ChevronRight className="h-4 w-4 opacity-20" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-3xl bg-primary text-primary-foreground overflow-hidden">
              <CardContent className="p-6 space-y-4 text-center">
                <ShieldAlert className="h-10 w-10 mx-auto opacity-50" />
                <div className="space-y-1">
                  <h4 className="font-black uppercase tracking-tighter">Compromisso VCA</h4>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-80">Segurança em primeiro lugar</p>
                </div>
                <p className="text-xs font-medium opacity-90">
                  Sempre realize pagamentos fora da plataforma apenas após a prestação do serviço.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {user.portfolio && user.portfolio.length > 0 && (
              <Card className="border-none shadow-xl rounded-[2rem] overflow-hidden group/gallery">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter italic">Galeria & Projetos</CardTitle>
                    <CardDescription className="text-xs font-medium uppercase tracking-widest">Serviços e realizações do profissional</CardDescription>
                  </div>
                  {user.portfolio?.length > 1 && (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full border-2"
                        onClick={() => setActiveSlide(prev => (prev === 0 ? user.portfolio.length - 1 : prev - 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full border-2"
                        onClick={() => setActiveSlide(prev => (prev === user.portfolio.length - 1 ? 0 : prev + 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div 
                      className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted group/item"
                      onTouchStart={onTouchStart}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                    >
                      <img 
                        src={user.portfolio[activeSlide].url} 
                        className="w-full h-full object-cover transition-all duration-500" 
                        alt="Portfolio" 
                        draggable={false}
                      />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        {user.portfolio.map((_: any, idx: number) => (
                          <div 
                            key={idx} 
                            className={cn(
                              "h-1.5 rounded-full transition-all duration-300",
                              activeSlide === idx ? "w-6 bg-primary" : "w-1.5 bg-white/40"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">Minha Lojinha</h2>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Produtos anunciados pelo profissional</p>
                </div>
                
                {isOwnProfile && (
                  <Dialog open={adFormOpen} onOpenChange={setAdFormOpen}>
                    <DialogTrigger asChild>
                      <Button className="rounded-2xl h-10 px-4 font-bold uppercase tracking-wider shadow-lg shadow-primary/20 gap-2">
                        <Plus className="h-4 w-4" />
                        Criar Anúncio
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-2 p-8 overflow-y-auto max-h-[90vh]">
                      <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic text-center">Novo Anúncio</DialogTitle>
                      </DialogHeader>
                      <AdForm 
                        onSuccess={() => {
                          setAdFormOpen(false);
                          fetchUserAds();
                        }} 
                        onCancel={() => setAdFormOpen(false)} 
                      />
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              {loadingAds ? (
                <div className="flex py-12 justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
                </div>
              ) : userAds.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userAds.map((ad) => (
                      <AdCard key={ad.id} ad={ad} />
                    ))}
                  </div>

                  {adPagination && adPagination.pages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        disabled={adPage === 1}
                        onClick={() => handleAdPageChange(adPage - 1)}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: adPagination.pages }, (_, i) => i + 1).map((p) => (
                          <Button
                            key={p}
                            variant={adPage === p ? "default" : "ghost"}
                            size="icon"
                            className={cn(
                              "h-10 w-10 rounded-xl font-bold uppercase text-[10px]",
                              adPage === p ? "shadow-lg shadow-primary/20" : "text-muted-foreground"
                            )}
                            onClick={() => handleAdPageChange(p)}
                          >
                            {p}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-xl"
                        disabled={adPage === adPagination.pages}
                        onClick={() => handleAdPageChange(adPage + 1)}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-background rounded-[2rem] border-2 border-dashed border-muted p-12 text-center space-y-4">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="h-8 w-8 text-muted-foreground opacity-20" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Lojinha Vazia</p>
                    <p className="text-[10px] text-muted-foreground/60 max-w-[200px] mx-auto uppercase font-medium">Nenhum produto anunciado no momento.</p>
                  </div>
                  {isOwnProfile && (
                    <Button variant="outline" onClick={() => setAdFormOpen(true)} className="rounded-xl font-bold uppercase tracking-tight">
                      Começar a Vender
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
