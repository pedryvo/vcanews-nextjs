"use client";

import { useEffect, useState } from "react";
import { Mail, MessageSquare, Clock, User, Trash2, Search, ExternalLink, AlertCircle, Info, Target } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 50;

  useEffect(() => {
    fetchMessages(currentPage);
  }, [currentPage]);

  const fetchMessages = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Falha ao buscar mensagens");
      const data = await res.json();
      setMessages(data.messages);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Falha ao excluir");
      toast.success("Mensagem excluída");
      fetchMessages(currentPage);
    } catch (error) {
      toast.error("Erro ao excluir mensagem");
    }
  };

  const filteredMessages = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Inbox Admin
            </h1>
            <p className="text-slate-500 font-medium">
              {total} mensagens recebidas no total.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar mensagens..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {loading && messages.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-xl font-black uppercase tracking-widest text-slate-200">Carregando mensagens...</div>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
            <Mail className="h-10 w-10 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nenhuma mensagem aqui.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className="bg-white border-2 border-slate-100 hover:border-blue-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-slate-950 text-[8px] font-black uppercase text-white px-3 py-1 rounded-lg tracking-widest">
                        {format(new Date(msg.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                      </span>
                      <h2 className="text-lg font-black tracking-tight text-slate-800 line-clamp-1 uppercase">
                        {msg.subject}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4 text-xs font-bold text-slate-500 uppercase tracking-tight">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-slate-900">{msg.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-300" />
                        <span className="text-slate-400 font-medium lowercase tracking-normal">{msg.email}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100 space-y-3">
                      <p className="text-slate-600 text-sm leading-relaxed italic">
                        "{msg.message}"
                      </p>
                      
                      <div className="pt-3 border-t border-slate-200/60 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span className="bg-white px-2 py-1 rounded-md border border-slate-100 flex items-center gap-1.5 transition-colors hover:border-blue-200 hover:text-blue-500">
                          <Info className="h-3 w-3" />
                          IP: {msg.ip || "Não capturado"}
                        </span>
                        <span className="bg-white px-2 py-1 rounded-md border border-slate-100 flex items-center gap-1.5 transition-colors hover:border-emerald-200 hover:text-emerald-500">
                          <Target className="h-3 w-3" />
                          {msg.location || "Localização desconhecida"}
                        </span>
                        <span className="bg-white px-2 py-1 rounded-md border border-slate-100 flex items-center gap-1.5 transition-colors hover:border-amber-200 hover:text-amber-500 max-w-[200px] truncate" title={msg.userAgent}>
                          Navegador: {msg.userAgent || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="h-11 w-11 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2.5rem] border-2 shadow-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-black tracking-tight uppercase text-xl text-slate-900">Excluir Mensagem?</DialogTitle>
                          <DialogDescription className="font-medium text-slate-500 text-base leading-relaxed">
                            Esta ação é irreversível. A mensagem enviada por <strong>{msg.name}</strong> será removida permanentemente do banco de dados.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-3 mt-4">
                          <DialogClose asChild>
                            <button className="h-12 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 border-slate-100 hover:bg-slate-50 transition-all">Cancelar</button>
                          </DialogClose>
                          <button 
                            onClick={() => handleDelete(msg.id)}
                            className="h-12 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-lg shadow-rose-200"
                          >
                            Sim, Excluir Agora
                          </button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <a
                      href={`mailto:${msg.email}`}
                      className="h-11 w-11 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-sm"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </AdminLayout>
  );
}
