"use client";

import { useState, useEffect, use } from "react";
import { 
  User as UserIcon, 
  MapPin, 
  Calendar, 
  Briefcase, 
  AlertTriangle,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PublicProfileProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: PublicProfileProps) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="-mt-20 md:-mt-32 mb-6 flex flex-col md:flex-row md:items-end gap-6 relative z-10">
          <Avatar className="w-40 h-40 md:w-56 md:h-56 border-8 border-background shadow-2xl rounded-full">
            <AvatarImage src={user.image || ""} className="object-cover" />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground font-black">
              {user.name?.[0] || "?"}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-2 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase whitespace-nowrap">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Esquerda: Sobre */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Sobre</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user.bio ? (
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
                    "{user.bio}"
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground opacity-50 italic">
                    Nenhuma biografia disponível.
                  </p>
                )}
                
                {user.profession?.category && (
                  <div className="pt-4 border-t space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Expertise em</span>
                    <Badge variant="outline" className="w-full justify-center py-2 rounded-xl text-xs">
                      {user.profession.category.name}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Coluna Direita: Atividade */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Denúncias Recentes
              </h2>
              <span className="text-xs font-bold text-muted-foreground uppercase">{user.denuncias?.length || 0} Publicadas</span>
            </div>

            {user.denuncias && user.denuncias.length > 0 ? (
              <div className="grid gap-4">
                {user.denuncias.map((denuncia: any) => (
                  <Link key={denuncia.id} href={`/denuncias`}>
                    <Card className="hover:border-primary/50 transition-all group overflow-hidden border-none shadow-lg">
                      <CardContent className="p-0 flex flex-col md:flex-row h-full md:h-32">
                        {denuncia.imageUrl && (
                          <div className="w-full md:w-32 h-32 shrink-0">
                            <img 
                              src={denuncia.imageUrl} 
                              alt="" 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                            />
                          </div>
                        )}
                        <div className="p-4 flex flex-col justify-center gap-1 min-w-0">
                          <h4 className="font-bold truncate text-sm md:text-base">{denuncia.titulo}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{denuncia.descricao}</p>
                          <span className="text-[10px] text-primary mt-1 font-mono">
                            {new Date(denuncia.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <Card className="border-dashed border-2 bg-transparent">
                <CardContent className="py-20 text-center">
                  <AlertTriangle className="h-10 w-10 mx-auto text-muted-foreground opacity-20 mb-4" />
                  <p className="text-muted-foreground">Nenhuma denúncia feita por este usuário ainda.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
