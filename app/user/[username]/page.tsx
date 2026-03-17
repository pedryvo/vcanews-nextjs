"use client";

import { useState, useEffect, use } from "react";
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
  ShieldAlert,
  Camera
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PublicProfileProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: PublicProfileProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startingBudget, setStartingBudget] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    async function fetchPublicProfile() {
      try {
        const res = await fetch(`/api/user/${resolvedParams.username}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    }
    fetchPublicProfile();
  }, [resolvedParams.username]);

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

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-20 text-center">
        <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Perfil não encontrado</h1>
        <p className="text-muted-foreground mt-2">O usuário que você procura não existe ou mudou de nome.</p>
        <Button asChild className="mt-6 rounded-full" variant="outline">
          <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Início</Link>
        </Button>
      </div>
    );
  }

  const isOwnProfile = (session as any)?.user?.id === user.id;

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
          {/* Avatar com margem negativa isolada */}
          <div className="-mt-20 md:-mt-32">
            <Avatar className="w-40 h-40 md:w-56 md:h-56 border-8 border-background shadow-2xl rounded-full">
              <AvatarImage src={user.image || ""} className="object-cover" />
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-black">
                {user.name?.[0] || "?"}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Informações do usuário abaixo da linha da capa */}
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
          {/* Coluna Esquerda: Sobre */}
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

          {/* Coluna Direita: Informações Adicionais / Showcase */}
          <div className="lg:col-span-2 space-y-6">
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
                {user.portfolio && user.portfolio.length > 0 ? (
                  <div className="space-y-4">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted group/item">
                      <img 
                        src={user.portfolio[activeSlide].url} 
                        className="w-full h-full object-cover transition-all duration-500" 
                        alt="Portfolio" 
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
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed border-muted rounded-3xl text-center space-y-4">
                    <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-muted-foreground opacity-20" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Galeria Vazia</p>
                      <p className="text-[10px] text-muted-foreground/60 max-w-[200px] mx-auto uppercase font-medium">Este profissional ainda não adicionou fotos ao seu portfólio.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
