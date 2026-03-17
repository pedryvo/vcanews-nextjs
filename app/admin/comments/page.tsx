"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trash2, MessageSquare, ExternalLink, Calendar, Search } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Pagination } from "@/components/admin/Pagination";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const limit = 50;

  const fetchComments = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/comments?page=${page}&limit=${limit}`);
      const data = await res.json();
      setComments(data.comments || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("Erro ao carregar comentários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(currentPage);
  }, [currentPage]);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este comentário permanentemente?")) return;
    
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Comentário excluído.");
        fetchComments(currentPage);
      } else {
        toast.error("Erro ao excluir.");
      }
    } catch (error) {
      toast.error("Erro na conexão.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Moderação de Conversas
            </h1>
            <p className="text-slate-500 font-medium">
              {total} comentários registrados na plataforma.
            </p>
          </div>
        </header>

        {loading && comments.length === 0 ? (
          <div className="space-y-4">
             {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-slate-50 animate-pulse rounded-[2rem] border-2 border-slate-100" />
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-slate-50/50 border-slate-200">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Nenhum comentário encontrado</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="border-2 hover:border-blue-100 transition-all rounded-[2rem] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 bg-white overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarImage src={comment.user?.image || ""} className="object-cover" />
                        <AvatarFallback className="font-black bg-slate-50 text-slate-400">
                            {comment.user?.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1.5">
                          <span className="font-black text-slate-800 uppercase tracking-tight">{comment.user?.name || "Anônimo"}</span>
                          <div className="flex items-center gap-1.5 text-slate-300">
                            <Calendar className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest mt-0.5">
                                {format(new Date(comment.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                        <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 mb-3">
                            <p className="text-sm text-slate-600 leading-relaxed italic line-clamp-2">
                            "{comment.text}"
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none rounded-lg text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                                EM: {comment.denuncia?.titulo || "NOTÍCIA"}
                            </Badge>
                            <Link href={`/denuncias`} target="_blank" className="text-slate-400 hover:text-blue-500 transition-colors">
                                <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-11 w-11 rounded-2xl text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition-all"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
