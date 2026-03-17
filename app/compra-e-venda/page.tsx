"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AdCard } from "@/components/Shop/AdCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Loader2, Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, ShoppingBag, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AdForm } from "@/components/Shop/AdForm";

function MarketplaceContent() {
  const [ads, setAds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    categoryId: "all",
    subcategoryId: "all",
    minPrice: "",
    maxPrice: "",
    page: 1,
  });
  const [pagination, setPagination] = useState<any>(null);
  const [adFormOpen, setAdFormOpen] = useState(false);
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  useEffect(() => {
    if (searchParams?.get("create") === "true" && session) {
      setAdFormOpen(true);
    }
  }, [searchParams, session]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/marketplace/categories");
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
    fetchAds();
  }, [filters]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.categoryId !== "all") params.append("categoryId", filters.categoryId);
      if (filters.subcategoryId !== "all") params.append("subcategoryId", filters.subcategoryId);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      params.append("page", filters.page.toString());

      const res = await fetch(`/api/marketplace?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setAds(data.ads);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedCategory = categories.find(c => c.id === filters.categoryId);

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Header Estilizado */}
      <div className="bg-background border-b pt-12 pb-16">
        <div className="container mx-auto px-4 text-center space-y-4">
          <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 uppercase font-black tracking-[0.2em] text-[10px] px-4 py-1.5 rounded-full">
            Marketplace VCA
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">
            Compra e Venda
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto font-medium text-sm md:text-base">
            O ponto de encontro para quem quer desapegar ou encontrar as melhores oportunidades em Vitória da Conquista.
          </p>

          {session && (
            <div className="pt-4">
              <Dialog open={adFormOpen} onOpenChange={setAdFormOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 gap-2 bg-orange-500 hover:bg-orange-600 border-b-4 border-orange-700 active:border-b-0 active:translate-y-1 transition-all">
                    <Plus className="h-5 w-5" />
                    Criar meu Anúncio
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-2 p-8 overflow-y-auto max-h-[90vh]">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic text-center">Novo Anúncio</DialogTitle>
                  </DialogHeader>
                  <AdForm 
                    onSuccess={() => {
                      setAdFormOpen(false);
                      fetchAds();
                    }} 
                    onCancel={() => setAdFormOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Barra de Filtros */}
        <div className="bg-background rounded-[2rem] shadow-2xl border-2 p-6 md:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="w-full lg:w-1/4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Categoria</label>
              <Select 
                value={filters.categoryId} 
                onValueChange={(val) => setFilters(prev => ({ ...prev, categoryId: val, subcategoryId: "all", page: 1 }))}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 font-bold focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Todas Categorias" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2">
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:w-1/4 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subcategoria</label>
              <Select 
                value={filters.subcategoryId} 
                disabled={filters.categoryId === "all"}
                onValueChange={(val) => setFilters(prev => ({ ...prev, subcategoryId: val, page: 1 }))}
              >
                <SelectTrigger className="h-12 rounded-2xl border-2 font-bold focus:ring-primary/20 transition-all">
                  <SelectValue placeholder="Todas Subcategorias" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2">
                  <SelectItem value="all">Todas Subcategorias</SelectItem>
                  {selectedCategory?.subcategories.map((sub: any) => (
                    <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full lg:flex-1 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preço Mín.</label>
                <Input 
                  type="number" 
                  placeholder="R$ 0,00"
                  className="h-12 rounded-2xl border-2 font-bold focus:ring-primary/20 transition-all"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value, page: 1 }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preço Máx.</label>
                <Input 
                  type="number" 
                  placeholder="R$ Máx"
                  className="h-12 rounded-2xl border-2 font-bold focus:ring-primary/20 transition-all"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value, page: 1 }))}
                />
              </div>
            </div>

            <Button 
              variant="outline"
              className="h-12 w-full lg:w-auto px-8 rounded-2xl border-2 font-black uppercase tracking-wider gap-2 hover:bg-muted"
              onClick={() => setFilters({ categoryId: "all", subcategoryId: "all", minPrice: "", maxPrice: "", page: 1 })}
            >
              Limpar
            </Button>
          </div>
        </div>

        {/* Grid de Anúncios */}
        <div className="mt-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Carregando oportunidades...</p>
            </div>
          ) : ads.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {ads.map((ad) => (
                <AdCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center bg-background rounded-[3rem] border-2 border-dashed border-muted text-center p-8 space-y-6">
              <div className="bg-muted h-24 w-24 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase tracking-tighter">Nenhum anúncio encontrado</h3>
                <p className="text-muted-foreground max-w-xs mx-auto text-sm font-medium">Tente ajustar seus filtros para encontrar o que procura.</p>
              </div>
              <Button 
                onClick={() => setFilters({ categoryId: "all", subcategoryId: "all", minPrice: "", maxPrice: "", page: 1 })}
                className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest"
              >
                Ver todos os anúncios
              </Button>
            </div>
          )}
        </div>

        {/* Paginação */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-2xl border-2"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={pagination.page === p ? "default" : "outline"}
                  className={`h-12 w-12 rounded-2xl border-2 font-black text-xs ${
                    pagination.page === p ? "shadow-lg shadow-primary/20" : ""
                  }`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ))}
            </div>

            <div className="sm:hidden bg-background px-4 h-12 rounded-2xl border-2 flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{pagination.page}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">/</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{pagination.pages}</span>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-2xl border-2"
              disabled={pagination.page === pagination.pages}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
