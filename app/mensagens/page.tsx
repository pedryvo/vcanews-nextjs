"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { 
  Search, 
  MessageSquare, 
  User as UserIcon, 
  Clock, 
  ChevronRight,
  Inbox,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MensagensPage() {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") return;
    async function fetchConversations() {
      try {
        const res = await fetch("/api/budgets");
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Failed to fetch conversations");
      } finally {
        setLoading(false);
      }
    }
    fetchConversations();
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container py-20 text-center space-y-4">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Acesso Restrito</h1>
        <p className="text-muted-foreground">Você precisa estar logado para ver suas mensagens.</p>
      </div>
    );
  }

  const filtered = conversations.filter(c => {
    const other = c.senderId === (session?.user as any).id ? c.receiver : c.sender;
    return other.name.toLowerCase().includes(search.toLowerCase()) || 
           other.username.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-8">
      <div className="container max-w-4xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Suas Conversas</h1>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Gerencie seus orçamentos e mensagens</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nome..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl bg-background border-2 focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.length > 0 ? (
            filtered.map((c) => {
              const other = c.senderId === (session?.user as any).id ? c.receiver : c.sender;
              const lastMsg = c.messages[0]?.content || "Inicie a conversa...";
              const isFinished = c.status === "FINISHED";

              return (
                <Link key={c.id} href={`/mensagens/${c.id}`}>
                  <Card className={cn(
                    "group border-none shadow-lg rounded-2xl overflow-hidden hover:scale-[1.01] transition-all duration-300",
                    isFinished ? "opacity-60 grayscale-[0.5] bg-zinc-100/80" : "hover:bg-primary/5 bg-background"
                  )}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 border-2 border-background shadow-md">
                          <AvatarImage src={other.image || ""} className="object-cover" />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {other.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {!isFinished && (
                          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold truncate text-sm md:text-base group-hover:text-primary transition-colors">
                            {other.name}
                          </h3>
                          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                            {c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' }) : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                          <p className="text-xs text-muted-foreground truncate italic">
                            {lastMsg}
                          </p>
                          {isFinished && (
                            <Badge variant="outline" className="text-[8px] h-4 uppercase font-black tracking-widest px-1">Finalizado</Badge>
                          )}
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 opacity-10 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-24 bg-background rounded-3xl border-2 border-dashed shadow-xl space-y-4">
              <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Inbox className="h-8 w-8 text-muted-foreground opacity-30" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter">Nenhuma conversa ativa</h2>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground opacity-60">Visite o perfil de um profissional para iniciar um orçamento.</p>
              </div>
              <Link href="/profissionais">
                <Button variant="outline" className="rounded-xl mt-4">Ver Profissionais</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
