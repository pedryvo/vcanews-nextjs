"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Trash2, 
  ShieldCheck, 
  User as UserIcon, 
  MoreVertical,
  ShieldAlert,
  Calendar,
  Slash,
  Users
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Pagination } from "@/components/admin/Pagination";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 50;

  const fetchUsers = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${search}&page=${page}&limit=${limit}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      toast.error("Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        setCurrentPage(1);
        fetchUsers(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  async function handleUpdateRole(id: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      toast.success(`Usuário ${newRole === "ADMIN" ? "promovido" : "rebaixado"} com sucesso!`);
      fetchUsers(currentPage);
    } else {
      const error = await res.json();
      toast.error(error.error || "Erro ao atualizar role.");
    }
  }

  async function handleDeleteUser(id: string) {
    if (!confirm("Tem certeza que deseja excluir permanentemente este usuário? Esta ação não pode ser desfeita.")) {
      return;
    }

    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Usuário excluído com sucesso!");
      fetchUsers(currentPage);
    } else {
      const error = await res.json();
      toast.error(error.error || "Erro ao excluir usuário.");
    }
  }

  async function handleToggleBlock(id: string, currentStatus: boolean) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isBlocked: !currentStatus }),
    });

    if (res.ok) {
      toast.success(`Usuário ${!currentStatus ? "bloqueado" : "desbloqueado"} com sucesso!`);
      fetchUsers(currentPage);
    } else {
      const error = await res.json();
      toast.error(error.error || "Erro ao alterar status de bloqueio.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Controle de Usuários
            </h1>
            <p className="text-slate-500 font-medium font-mono text-xs uppercase tracking-widest">
              {total} membros cadastrados na rede.
            </p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Nome, e-mail ou username..."
              className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {loading && users.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-44 bg-slate-50 animate-pulse rounded-[2.5rem] border-2 border-slate-100" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed rounded-[3rem] bg-slate-50/50 border-slate-200">
            <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className={cn(
                "group border-2 hover:border-blue-100 transition-all rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 bg-white relative",
                user.isBlocked && "opacity-60 grayscale-[0.5]"
              )}>
                <CardContent className="p-6 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14 border-4 border-slate-50 shadow-sm ring-1 ring-slate-100">
                        <AvatarImage src={user.image || ""} className="object-cover" />
                        <AvatarFallback className="bg-slate-100 text-slate-400 font-black">
                          {user.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-base font-black text-slate-800 uppercase tracking-tight truncate">
                            {user.name || "Sem Nome"}
                          </p>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate font-bold uppercase tracking-tighter">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-2 shadow-2xl p-1.5 w-52 z-[101]">
                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer gap-3 p-3"
                          onClick={() => handleUpdateRole(user.id, user.role)}
                        >
                          {user.role === "ADMIN" ? (
                            <> <UserIcon className="h-4 w-4 text-slate-400" /> Rebaixar para USER </>
                          ) : (
                            <> <ShieldCheck className="h-4 w-4 text-blue-500" /> Tornar ADMIN </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem 
                          className={cn(
                            "rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer gap-3 p-3",
                            user.isBlocked ? "text-emerald-600 focus:bg-emerald-50" : "text-amber-600 focus:bg-amber-50"
                          )}
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                        >
                          <Slash className="h-4 w-4" />
                          {user.isBlocked ? "Desbloquear" : "Bloquear"}
                        </DropdownMenuItem>

                        <div className="h-px bg-slate-100 my-1" />

                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-[10px] uppercase tracking-widest cursor-pointer gap-3 p-3 text-rose-500 focus:bg-rose-50 focus:text-rose-600"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-4 w-4" /> Excluir Conta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t-2 border-slate-50 border-dashed">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-lg w-fit lowercase">
                        @{user.username || "sem-username"}
                      </span>
                    </div>

                    <Badge className={cn(
                      "rounded-xl px-3 py-1 text-[9px] font-black uppercase tracking-widest border-none",
                      user.role === "ADMIN" 
                        ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                        : "bg-slate-100 text-slate-500 shadow-none"
                    )}>
                      {user.role === "ADMIN" ? (
                        <span className="flex items-center gap-1.5">
                          <ShieldAlert className="h-3 w-3 text-amber-400" /> ADMIN
                        </span>
                      ) : "USER"}
                    </Badge>
                  </div>
                  {user.isBlocked && (
                     <div className="absolute top-2 right-12">
                        <Badge variant="destructive" className="text-[8px] font-black uppercase px-2 h-5 rounded-lg shadow-sm">Bloqueado</Badge>
                     </div>
                  )}
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

