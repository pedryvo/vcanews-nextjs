"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check, X, Clock, Trash2, ShieldAlert, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminDenunciasPage() {
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 50;

  const fetchDenuncias = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/denuncias?page=${page}&limit=${limit}`);
      const data = await res.json();
      setDenuncias(data.denuncias || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("Erro ao carregar denúncias");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDenuncias(currentPage);
  }, [currentPage]);

  async function handleAction(id: string, action: "approve" | "reject") {
    const res = await fetch(`/api/admin/denuncias/${id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (res.ok) {
      toast.success(action === "approve" ? "Denúncia aprovada!" : "Denúncia rejeitada.");
      fetchDenuncias(currentPage);
    } else {
      toast.error("Erro ao processar ação.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir esta denúncia permanentemente?")) return;
    const res = await fetch(`/api/admin/denuncias/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Denúncia excluída.");
      fetchDenuncias(currentPage);
    } else {
      toast.error("Erro ao excluir.");
    }
  }

  const pending = denuncias.filter((d) => !d.aprovado);
  const approved = denuncias.filter((d) => d.aprovado);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Moderação de Denúncias
            </h1>
            <p className="text-slate-500 font-medium">
              {total} denúncias recebidas no total.
            </p>
          </div>
        </header>

        {loading && denuncias.length === 0 ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-slate-50 animate-pulse rounded-[2.5rem] border-2 border-slate-100" />
            ))}
          </div>
        ) : denuncias.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-slate-50/50 border-slate-200">
            <Clock className="h-12 w-12 mx-auto mb-4 text-slate-300" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Nenhuma denúncia encontrada</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {pending.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="bg-amber-500 h-2 w-2 rounded-full animate-ping" />
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-amber-600">
                      Pendentes ({pending.length})
                    </h2>
                </div>
                {pending.map((d) => (
                  <DenunciaAdminCard key={d.id} d={d} onAction={handleAction} onDelete={handleDelete} />
                ))}
              </section>
            )}
            {approved.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="bg-emerald-500 h-2 w-2 rounded-full" />
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
                      Publicadas ({approved.length})
                    </h2>
                </div>
                {approved.map((d) => (
                  <DenunciaAdminCard key={d.id} d={d} onAction={handleAction} onDelete={handleDelete} />
                ))}
              </section>
            )}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
    <Card className="overflow-hidden border-2 hover:border-blue-100 transition-all rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 bg-white group">
      <div className="flex flex-col md:flex-row min-h-[180px]">
        <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border-2 border-white shadow-sm ring-1 ring-slate-100">
                  <AvatarImage src={d.author?.image ?? ""} className="object-cover" />
                  <AvatarFallback className="text-[10px] font-black bg-slate-50">{d.author?.name?.[0] ?? "?"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">
                        {d.author?.name ?? "Anônimo"}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        {format(new Date(d.createdAt), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                    </span>
                </div>
              </div>
              <Badge variant="outline" className={cn(
                "rounded-xl px-3 h-6 text-[9px] font-black uppercase tracking-widest border-none",
                d.aprovado 
                  ? "bg-emerald-50 text-emerald-600" 
                  : "bg-amber-50 text-amber-600"
              )}>
                {d.aprovado ? "Publicada" : "Em Análise"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-tight leading-tight text-slate-800 group-hover:text-blue-600 transition-colors">
                {d.titulo}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                {d.descricao}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-4 border-t-2 border-slate-50 border-dashed">
            {!d.aprovado && (
              <Button size="sm" className="h-9 rounded-xl px-5 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-100"
                onClick={() => onAction(d.id, "approve")}>
                <Check className="h-3.5 w-3.5" /> Aprovar Pública
              </Button>
            )}
            {!d.aprovado && (
              <Button size="sm" variant="ghost" className="h-9 rounded-xl px-5 gap-2 font-black text-[10px] uppercase tracking-widest text-amber-600 hover:bg-amber-50"
                onClick={() => onAction(d.id, "reject")}>
                <X className="h-3.5 w-3.5" /> Recusar
              </Button>
            )}
            <Button size="sm" variant="ghost"
              className="h-9 rounded-xl px-5 gap-2 text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest ml-auto"
              onClick={() => onDelete(d.id)}>
              <Trash2 className="h-3.5 w-3.5" /> Excluir
            </Button>
          </div>
        </div>

        {d.imageUrl && (
          <div className="w-full md:w-[280px] lg:w-[380px] shrink-0 relative group-hover:opacity-95 transition-opacity bg-slate-100 overflow-hidden m-2 rounded-[2rem]">
            <img 
              src={d.imageUrl} 
              alt="Anexo da denúncia" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-xl border border-white/50">
                <ImageIcon className="h-4 w-4 text-slate-600" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

