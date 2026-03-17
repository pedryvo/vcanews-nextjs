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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{d.titulo}</CardTitle>
          <Badge variant="outline" className={d.aprovado
            ? "shrink-0 text-green-600 border-green-400"
            : "shrink-0 text-yellow-600 border-yellow-400"
          }>
            {d.aprovado ? "Publicada" : "Pendente"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Avatar className="h-5 w-5">
            <AvatarImage src={d.user?.image ?? ""} />
            <AvatarFallback className="text-[10px]">{d.user?.name?.[0] ?? "?"}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">
            {d.user?.name ?? "Anônimo"} · {new Date(d.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{d.descricao}</p>
        {d.imageUrl && (
          <div className="rounded-lg overflow-hidden border">
            <img src={d.imageUrl} alt="Foto da denúncia" className="w-full object-cover" />
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          {!d.aprovado && (
            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => onAction(d.id, "approve")}>
              <Check className="h-4 w-4" /> Aprovar
            </Button>
          )}
          {!d.aprovado && (
            <Button size="sm" variant="destructive" className="gap-2"
              onClick={() => onAction(d.id, "reject")}>
              <X className="h-4 w-4" /> Rejeitar
            </Button>
          )}
          <Button size="sm" variant="outline"
            className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground ml-auto"
            onClick={() => onDelete(d.id)}>
            <Trash2 className="h-4 w-4" /> Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
