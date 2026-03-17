"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminDenunciasPage() {
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/denuncias");
      const data = await res.json();
      setDenuncias(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    const res = await fetch(`/api/admin/denuncias/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      toast.success(action === "approve" ? "Denúncia aprovada!" : "Denúncia rejeitada.");
      fetchAll();
    } else {
      toast.error("Erro ao processar ação.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta denúncia permanentemente?")) return;
    const res = await fetch(`/api/admin/denuncias/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Denúncia excluída.");
      setDenuncias((prev) => prev.filter((d) => d.id !== id));
    } else {
      toast.error("Erro ao excluir.");
    }
  }

  const pending = denuncias.filter((d) => !d.aprovado);
  const approved = denuncias.filter((d) => d.aprovado);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Denúncias</h1>
          <p className="text-muted-foreground text-sm">
            {pending.length} pendente(s) · {approved.length} publicada(s)
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : denuncias.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>Nenhuma denúncia ainda.</p>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Pendentes ({pending.length})
                </h2>
                {pending.map((d) => (
                  <DenunciaAdminCard key={d.id} d={d} onAction={handleAction} onDelete={handleDelete} />
                ))}
              </section>
            )}
            {approved.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Publicadas ({approved.length})
                </h2>
                {approved.map((d) => (
                  <DenunciaAdminCard key={d.id} d={d} onAction={handleAction} onDelete={handleDelete} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}

function DenunciaAdminCard({ d, onAction, onDelete }: {
  d: any;
  onAction: (id: string, action: "approve" | "reject") => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all shadow-sm hover:shadow-md group">
      <div className="flex flex-col md:flex-row min-h-[180px]">
        {/* Lado Esquerdo: Conteúdo e Ações */}
        <div className="flex-1 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 border">
                  <AvatarImage src={d.user?.image ?? ""} />
                  <AvatarFallback className="text-[10px] font-bold">{d.user?.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  {d.user?.name ?? "Anônimo"} • {new Date(d.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <Badge variant="outline" className={cn(
                "rounded-full px-3 text-[10px] font-black uppercase tracking-tighter",
                d.aprovado 
                  ? "bg-green-500/10 text-green-600 border-green-500/20" 
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              )}>
                {d.aprovado ? "Publicada" : "Pendente"}
              </Badge>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black uppercase tracking-tight leading-tight group-hover:text-primary transition-colors">
                {d.titulo}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                {d.descricao}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-dashed">
            {!d.aprovado && (
              <Button size="sm" className="h-8 rounded-full px-4 gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] uppercase tracking-wider"
                onClick={() => onAction(d.id, "approve")}>
                <Check className="h-3 w-3" /> Aprovar
              </Button>
            )}
            {!d.aprovado && (
              <Button size="sm" variant="destructive" className="h-8 rounded-full px-4 gap-2 font-bold text-[10px] uppercase tracking-wider"
                onClick={() => onAction(d.id, "reject")}>
                <X className="h-3 w-3" /> Rejeitar
              </Button>
            )}
            <Button size="sm" variant="ghost"
              className="h-8 rounded-full px-4 gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive font-bold text-[10px] uppercase tracking-wider ml-auto"
              onClick={() => onDelete(d.id)}>
              <Trash2 className="h-3 w-3" /> Excluir
            </Button>
          </div>
        </div>

        {/* Lado Direito: Imagem (Proporção horizontal) */}
        {d.imageUrl && (
          <div className="w-full md:w-[240px] lg:w-[320px] shrink-0 border-l relative group-hover:opacity-90 transition-opacity bg-muted overflow-hidden">
            <img 
              src={d.imageUrl} 
              alt="Foto da denúncia" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/20 to-transparent pointer-events-none" />
          </div>
        )}
      </div>
    </Card>
  );
}

function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ");
}
