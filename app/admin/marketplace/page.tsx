"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Loader2,
  Package,
  ExternalLink,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AdForm } from "@/components/Shop/AdForm";

export default function AdminMarketplacePage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("PENDING");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [editingAd, setEditingAd] = useState<any>(null);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/marketplace?status=${filter}`);
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads);
      } else {
        toast.error("Erro ao carregar anúncios");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [filter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/marketplace/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        toast.success(status === "APPROVED" ? "Anúncio aprovado!" : "Anúncio reprovado.");
        setAds(ads.filter(ad => ad.id !== id));
      } else {
        toast.error("Erro ao atualizar status");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este anúncio permanentemente?")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/marketplace/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Anúncio excluído!");
        setAds(ads.filter(ad => ad.id !== id));
      } else {
        toast.error("Erro ao excluir anúncio");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setProcessingId(null);
    }
  };

  const statusColors: any = {
    PENDING: "bg-yellow-500",
    APPROVED: "bg-green-500",
    REJECTED: "bg-red-500",
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestão de Anúncios</h1>
            <p className="text-muted-foreground">Aprove ou reprove os produtos do marketplace.</p>
          </div>
        </div>

        <div className="flex gap-2">
          {["PENDING", "APPROVED", "REJECTED"].map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
              className="rounded-full px-4 text-[10px] font-black uppercase tracking-widest"
            >
              {s === "PENDING" ? "Pendentes" : s === "APPROVED" ? "Aprovados" : "Reprovados"}
            </Button>
          ))}
        </div>

        <Card className="rounded-[2rem] overflow-hidden border-2 shadow-sm">
          <CardHeader className="bg-muted/50 border-b px-6 py-4">
            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Package className="h-4 w-4" />
              Listagem de Anúncios ({ads.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex h-60 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : ads.length === 0 ? (
              <div className="flex h-60 flex-col items-center justify-center text-muted-foreground italic text-sm">
                Nenhum anúncio encontrado com status {filter}.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="w-[80px]">Foto</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Vendedor</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ads.map((ad) => (
                    <TableRow key={ad.id} className="hover:bg-muted/20 transition-colors">
                      <TableCell>
                        <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden">
                          {ad.images[0] && (
                            <img 
                              src={ad.images[0].url} 
                              alt={ad.title} 
                              className="h-full w-full object-cover" 
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-bold text-sm uppercase tracking-tighter truncate max-w-[200px]">
                          {ad.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
                          {ad.subcategory.category.name} / {ad.subcategory.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{ad.user.name}</span>
                          <span className="text-[10px] text-muted-foreground">@{ad.user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs font-bold">
                        {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(ad.price)}
                      </TableCell>
                      <TableCell className="text-[10px] uppercase font-medium text-muted-foreground">
                        {format(new Date(ad.createdAt), "dd MMM yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full" 
                            asChild
                            title="Ver Anúncio"
                          >
                            <Link href={`/compra-e-venda/${ad.id}`} target="_blank">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-50" 
                            onClick={() => setEditingAd(ad)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10" 
                            onClick={() => handleDelete(ad.id)}
                            disabled={processingId === ad.id}
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>

                          {filter === "PENDING" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(ad.id, "APPROVED")}
                                disabled={!!processingId}
                                className="h-8 rounded-full border-green-500/20 text-green-600 hover:bg-green-500/10 gap-2 font-bold text-[10px] uppercase tracking-widest px-4"
                              >
                                {processingId === ad.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3" />}
                                Aprovar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(ad.id, "REJECTED")}
                                disabled={!!processingId}
                                className="h-8 rounded-full border-red-500/20 text-red-600 hover:bg-red-500/10 gap-2 font-bold text-[10px] uppercase tracking-widest px-4"
                              >
                                {processingId === ad.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3" />}
                                Reprovar
                              </Button>
                            </>
                          )}

                          {filter === "REJECTED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(ad.id, "APPROVED")}
                              disabled={!!processingId}
                              className="h-8 rounded-full border-green-500/20 text-green-600 hover:bg-green-500/10 gap-2 font-bold text-[10px] uppercase tracking-widest px-4"
                            >
                              Reconsiderar
                            </Button>
                          )}
                          
                          {filter === "APPROVED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpdateStatus(ad.id, "REJECTED")}
                              disabled={!!processingId}
                              className="h-8 rounded-full border-red-500/20 text-red-600 hover:bg-red-500/10 gap-2 font-bold text-[10px] uppercase tracking-widest px-4"
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Modal de Edição */}
        <Dialog open={!!editingAd} onOpenChange={() => setEditingAd(null)}>
          <DialogContent className="max-w-2xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-muted/30 border-b">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                <Edit className="h-6 w-6 text-primary" />
                Editar Anúncio
              </DialogTitle>
            </DialogHeader>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              {editingAd && (
                <AdForm 
                  ad={editingAd} 
                  apiUrl={`/api/admin/marketplace/${editingAd.id}`}
                  onSuccess={() => {
                    setEditingAd(null);
                    fetchAds();
                  }}
                  onCancel={() => setEditingAd(null)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
