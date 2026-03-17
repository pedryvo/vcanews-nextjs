"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Slash
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?q=${search}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search]);

  async function handleUpdateRole(id: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (res.ok) {
      toast.success(`Usuário ${newRole === "ADMIN" ? "promovido" : "rebaixado"} com sucesso!`);
      fetchUsers();
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
      setUsers(prev => prev.filter(u => u.id !== id));
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
      fetchUsers();
    } else {
      const error = await res.json();
      toast.error(error.error || "Erro ao alterar status de bloqueio.");
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Gerenciar <span className="text-primary">Usuários</span></h1>
            <p className="text-muted-foreground text-sm font-medium">Controle de acessos, cargos e moderação de contas.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Nome, e-mail ou username..." 
              className="pl-10 rounded-xl border-2 h-11 focus-visible:ring-primary/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-3xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-[3rem] opacity-30">
            <UserIcon className="h-12 w-12 mx-auto mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.2em]">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className={cn(
                "group border-2 hover:border-primary/20 transition-all rounded-[2rem] overflow-hidden shadow-sm hover:shadow-lg bg-background",
                user.isBlocked && "opacity-60 saturate-50"
              )}>
                <CardContent className="p-4 flex flex-col justify-between h-full space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                        <AvatarImage src={user.image || ""} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {user.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                            {user.name || "Sem Nome"}
                          </p>
                          {user.isBlocked && <Badge variant="destructive" className="h-4 px-1 text-[8px] font-black uppercase">Bloqueado</Badge>}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate font-medium">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl border-2 shadow-xl p-1 w-48 z-[101]">
                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-xs uppercase cursor-pointer gap-2"
                          onClick={() => handleUpdateRole(user.id, user.role)}
                        >
                          {user.role === "ADMIN" ? (
                            <> <UserIcon className="h-3.5 w-3.5" /> Rebaixar para USER </>
                          ) : (
                            <> <ShieldCheck className="h-3.5 w-3.5" /> Tornar ADMIN </>
                          )}
                        </DropdownMenuItem>
                        
                        {/* BOTÃO BLOQUEAR */}
                        <DropdownMenuItem 
                          className={cn(
                            "rounded-xl font-bold text-xs uppercase cursor-pointer gap-2",
                            user.isBlocked ? "text-green-600 focus:text-green-600 focus:bg-green-50" : "text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                          )}
                          onClick={() => handleToggleBlock(user.id, user.isBlocked)}
                        >
                          <Slash className="h-3.5 w-3.5" />
                          {user.isBlocked ? "Desbloquear" : "Bloquear"}
                        </DropdownMenuItem>

                        <DropdownMenuItem 
                          className="rounded-xl font-bold text-xs uppercase cursor-pointer gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Excluir Conta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-dashed">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 opacity-50">
                        <Calendar className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                      <span className="text-[9px] font-black opacity-30 uppercase tracking-tighter truncate max-w-[120px]">
                        @{user.username || "sem-username"}
                      </span>
                    </div>

                    <Badge className={cn(
                      "rounded-full px-3 py-0.5 text-[9px] font-black uppercase tracking-widest",
                      user.role === "ADMIN" 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {user.role === "ADMIN" ? (
                        <span className="flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" /> ADMIN
                        </span>
                      ) : "USER"}
                    </Badge>
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

function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ");
}
