"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  ShoppingBag, 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { AdForm } from "@/components/Shop/AdForm";
import { cn } from "@/lib/utils";

export default function MyAdsPage() {
  const { data: session, status } = useSession();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAd, setEditingAd] = useState<any>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchUserAds();
    }
  }, [session?.user, page]);

  const fetchUserAds = async () => {
    setLoading(true);
    try {
      const userId = (session?.user as any).id;
      const res = await fetch(`/api/marketplace?userId=${userId}&page=${page}&limit=8`);
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads);
        setPagination(data.pagination);
      }
    } catch (error) {
      toast.error("Erro ao carregar seus anúncios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/marketplace/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Anúncio excluído com sucesso");
        fetchUserAds();
      } else {
        toast.error("Erro ao excluir anúncio");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-black uppercase tracking-tighter">Acesso Negado</h1>
        <p className="text-muted-foreground">Você precisa estar logado para gerenciar seus anúncios.</p>
        <Button asChild className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest mt-4">
          <Link href="/">Voltar para Início</Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (adStatus: string) => {
    switch (adStatus) {
      case "APPROVED":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-100 gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"><CheckCircle2 className="h-3 w-3" /> Ativo</Badge>;
      case "PENDING":
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-100 gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"><Clock className="h-3 w-3" /> Em Revisão</Badge>;
      case "REJECTED":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/10 gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"><XCircle className="h-3 w-3" /> Rejeitado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      <div className="bg-background border-b pt-12 pb-16">
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">Meus Anúncios</h1>
            <p className="text-muted-foreground font-medium text-sm">Gerencie suas publicações no Marketplace VCA</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl h-14 px-8 font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 gap-3 bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all">
                <Plus className="h-6 w-6" />
                Novo Anúncio
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-2 p-8 overflow-y-auto max-h-[90vh]">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic text-center">Novo Anúncio</DialogTitle>
              </DialogHeader>
              <AdForm 
                onSuccess={() => {
                  setIsCreateOpen(false);
                  fetchUserAds();
                }} 
                onCancel={() => setIsCreateOpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-background rounded-[3rem] border-2 shadow-2xl">
            <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Carregando seus anúncios...</p>
          </div>
        ) : ads.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {ads.map((ad) => (
                <Card key={ad.id} className="group overflow-hidden rounded-[2rem] border-2 shadow-xl hover:shadow-2xl transition-all duration-300 bg-background">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img 
                      src={ad.images[0]?.url || "/placeholder-ad.png"} 
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {getStatusBadge(ad.status)}
                    </div>
                  </div>
                  
                  <CardContent className="p-5 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black uppercase tracking-tight text-sm line-clamp-2 leading-tight flex-1">
                        {ad.title}
                      </h3>
                      <Link href={`/compra-e-venda/${ad.id}`} className="p-2 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                    
                    <p className="text-2xl font-black tracking-tighter italic text-primary">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ad.price)}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      <Clock className="h-3 w-3" />
                      {new Date(ad.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 gap-2">
                    <Dialog open={editingAdId === ad.id} onOpenChange={(open) => setEditingAdId(open ? ad.id : null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 rounded-xl h-10 border-2 font-bold uppercase text-[10px] tracking-widest gap-2">
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-2 p-8 overflow-y-auto max-h-[90vh]">
                        <DialogHeader className="mb-6">
                          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic text-center">Editar Anúncio</DialogTitle>
                        </DialogHeader>
                        <AdForm 
                          ad={ad} 
                          onSuccess={() => {
                            setEditingAdId(null);
                            fetchUserAds();
                          }} 
                          onCancel={() => setEditingAdId(null)} 
                        />
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" className="rounded-xl h-10 w-10 text-destructive hover:bg-destructive/10 hover:text-destructive border-2 border-transparent">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2rem] border-2">
                        <DialogHeader>
                          <DialogTitle className="font-black uppercase tracking-tighter text-2xl">Excluir Anúncio?</DialogTitle>
                          <DialogDescription className="font-medium">
                            Esta ação não pode ser desfeita. O anúncio será removido permanentemente do Marketplace VCA.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                          <DialogClose asChild>
                            <Button variant="outline" className="rounded-xl font-bold uppercase tracking-widest flex-1 sm:flex-none">
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button 
                            variant="destructive"
                            onClick={() => handleDelete(ad.id)}
                            className="rounded-xl font-bold uppercase tracking-widest flex-1 sm:flex-none"
                          >
                            Sim, Excluir
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-2xl border-2"
                  disabled={page === 1}
                  onClick={() => setPage(prev => prev - 1)}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <div className="flex items-center gap-2 bg-background p-2 rounded-2xl border-2 shadow-sm font-black text-xs uppercase tracking-widest text-muted-foreground px-6">
                  Página {page} de {pagination.pages}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-2xl border-2"
                  disabled={page === pagination.pages}
                  onClick={() => setPage(prev => prev + 1)}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-background rounded-[3rem] border-2 border-dashed border-muted text-center p-8 space-y-6 shadow-2xl">
            <div className="bg-muted h-24 w-24 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic">Você ainda não tem anúncios</h3>
              <p className="text-muted-foreground max-w-xs mx-auto text-sm font-medium">Bora desapegar de algo? Clique no botão acima para começar!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
