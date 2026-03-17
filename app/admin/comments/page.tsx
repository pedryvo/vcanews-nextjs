"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, MessageSquare, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/comments");
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Excluir este comentário permanentemente?")) return;
    
    try {
      const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Comentário excluído.");
        setComments((prev) => prev.filter((c) => c.id !== id));
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
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Comentários</h1>
          <p className="text-muted-foreground text-sm">
            {comments.length} comentário(s) no total
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : comments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border rounded-lg">
            <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p>Nenhum comentário encontrado.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div className="flex gap-3 flex-1 min-w-0">
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={comment.user?.image || ""} />
                        <AvatarFallback>{comment.user?.name?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-sm">{comment.user?.name || "Anônimo"}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        <p className="text-sm line-clamp-2 italic text-muted-foreground mb-2">
                          "{comment.text}"
                        </p>
                        <div className="flex items-center gap-1 text-[10px] font-medium text-primary uppercase tracking-wider">
                          <span className="text-muted-foreground lowercase font-normal italic pr-1">em</span>
                          {comment.denuncia?.titulo}
                          <Link href={`/denuncias`} target="_blank">
                             <ExternalLink className="h-3 w-3 inline-block ml-1 opacity-60" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end md:self-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:bg-destructive hover:text-destructive-foreground h-9 px-3"
                        onClick={() => handleDelete(comment.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Excluir
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
