"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, Briefcase, User as UserIcon, ArrowRight, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Professional {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  coverImage: string | null;
  bio: string | null;
  profession: {
    name: string;
    category: {
      name: string;
    }
  } | null;
}

export default function ProfissionaisVCA() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: "all",
    professionId: "all",
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/professions");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProfessionals() {
      try {
        const params = new URLSearchParams();
        if (search) params.append("q", search);
        if (filters.categoryId !== "all") params.append("categoryId", filters.categoryId);
        if (filters.professionId !== "all") params.append("professionId", filters.professionId);

        const res = await fetch(`/api/profissionais?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProfessionals(data);
        }
      } catch (error) {
        console.error("Failed to fetch", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchProfessionals();
    }, 300);

    return () => clearTimeout(timer);
  }, [search, filters]);

  const selectedCategory = categories.find(c => c.id === filters.categoryId);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Hero Section */}
      <div className="bg-background border-b pt-12 pb-16 px-4">
        <div className="container max-w-6xl mx-auto text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 text-primary font-bold uppercase tracking-widest text-[10px]">
            Conectando Talentos
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-zinc-900 leading-tight">
            Profissionais de <span className="text-primary italic">VCA</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base font-medium">
            Encontre os melhores prestadores de serviço e profissionais liberais de Vitória da Conquista em um só lugar.
          </p>

          <div className="max-w-xl mx-auto relative mt-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Busque por nome ou especialidade..." 
              className="h-14 pl-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-background shadow-xl shadow-primary/5 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 -mt-8 space-y-8">
        {/* Barra de Filtros */}
        <div className="bg-background rounded-[2rem] shadow-2xl border-2 p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="w-full lg:w-1/3 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Área de Atuação</label>
              </div>
              <Select
                value={filters.categoryId}
                onValueChange={(val: string) => setFilters(prev => ({ ...prev, categoryId: val, professionId: "all" }))}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 font-bold focus:ring-primary/20 bg-muted/20 hover:bg-muted/40 transition-all">
                  <SelectValue placeholder="Todas as Áreas" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 shadow-2xl">
                  <SelectItem value="all" className="font-bold">Todas as Áreas</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id} className="font-medium">{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-1/3 space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Profissão Específica</label>
              </div>
              <Select
                value={filters.professionId}
                disabled={filters.categoryId === "all"}
                onValueChange={(val: string) => setFilters(prev => ({ ...prev, professionId: val }))}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 font-bold focus:ring-primary/20 bg-muted/20 hover:bg-muted/40 transition-all">
                  <SelectValue placeholder="Todas as Profissões" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 shadow-2xl">
                  <SelectItem value="all" className="font-bold">Todas as Profissões</SelectItem>
                  {selectedCategory?.professions.map((prof: any) => (
                    <SelectItem key={prof.id} value={prof.id} className="font-medium">{prof.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:flex-1">
              <Button
                variant="outline"
                className="h-12 w-full px-8 rounded-2xl border-2 font-black uppercase tracking-wider gap-2 hover:bg-muted/80 transition-all"
                onClick={() => {
                  setSearch("");
                  setFilters({ categoryId: "all", professionId: "all" });
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-muted animate-pulse border-2" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionals.map((pro) => (
              <Link key={pro.id} href={`/user/${pro.username || pro.id}`}>
                <Card className="group border-none shadow-2xl rounded-[2.5rem] overflow-hidden hover:scale-[1.02] transition-all duration-500 bg-background flex flex-col h-full">
                  {/* Capa do Card */}
                  <div className="h-32 relative overflow-hidden bg-muted">
                    {pro.coverImage ? (
                      <img 
                        src={pro.coverImage} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                        alt=""
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                  </div>

                  <CardContent className="px-6 pb-8 -mt-10 relative z-10 flex flex-col flex-grow">
                    <div className="flex items-end justify-between mb-4">
                      <Avatar className="h-20 w-20 border-4 border-background shadow-xl rounded-full">
                        <AvatarImage src={pro.image || ""} className="object-cover" />
                        <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl">
                          {pro.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="p-2 bg-primary/10 rounded-2xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-lg shadow-primary/5">
                        <Briefcase className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors">
                        {pro.name}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                        <span className="text-primary">{pro.profession?.category.name}</span>
                        <span className="opacity-30">•</span>
                        <span>{pro.profession?.name}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-6 font-medium break-words overflow-hidden">
                      {pro.bio || "Este profissional ainda não adicionou uma biografia."}
                    </p>

                    <div className="mt-auto pt-4 border-t border-dashed border-muted flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-muted-foreground truncate max-w-[120px]">
                        @{pro.username}
                      </span>
                      <Button variant="ghost" size="sm" className="rounded-full gap-2 text-xs font-bold uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                        Ver Perfil
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {!loading && professionals.length === 0 && (
          <div className="text-center py-32 space-y-6 bg-background rounded-[3rem] shadow-xl border-2 border-dashed">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
              <UserIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black uppercase tracking-tight">Nenhum profissional encontrado</h2>
              <p className="text-muted-foreground font-medium">Tente ajustar sua busca ou procure por outra categoria.</p>
            </div>
            <Button variant="outline" onClick={() => setSearch("")} className="rounded-full px-8">
              Ver Todos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
