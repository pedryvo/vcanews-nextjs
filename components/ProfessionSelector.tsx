"use client";

import { useState, useEffect } from "react";
import { 
  ChevronRight, 
  Check, 
  Briefcase,
  ArrowLeft,
  Search,
  X
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Profession {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  professions: Profession[];
}

interface ProfessionSelectorProps {
  currentProfessionId?: string | null;
  onSelect: (id: string, name: string) => void;
}

export function ProfessionSelector({ currentProfessionId, onSelect }: ProfessionSelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"categories" | "professions">("categories");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchProfessions() {
      try {
        const res = await fetch("/api/professions");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch professions", error);
      }
    }
    fetchProfessions();
  }, []);

  useEffect(() => {
    if (currentProfessionId && categories.length > 0) {
      for (const cat of categories) {
        const found = cat.professions.find(p => p.id === currentProfessionId);
        if (found) {
          setSelectedName(found.name);
          break;
        }
      }
    }
  }, [currentProfessionId, categories]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStep("professions");
  };

  const handleBack = () => {
    setStep("categories");
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.professions.some(p => p.name.toLowerCase().includes(search.toLowerCase()))
  );

  const displayedProfessions = selectedCategory?.professions.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) {
        setStep("categories");
        setSelectedCategory(null);
        setSearch("");
      }
    }}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-between h-12 px-4 rounded-xl border-2 hover:border-primary/50 transition-all font-medium bg-muted/20"
        >
          <div className="flex items-center gap-2 truncate text-left">
            <Briefcase className="h-4 w-4 text-primary shrink-0" />
            <span className={cn("truncate", !selectedName && "text-muted-foreground")}>
              {selectedName || "Selecione sua profissão..."}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden rounded-3xl border-none shadow-2xl">
        <DialogHeader className="p-6 border-b bg-muted/20">
          <div className="flex items-center justify-between mb-4">
            <DialogTitle className="flex items-center gap-2 font-black uppercase tracking-tighter">
              {step === "professions" && (
                <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8 rounded-full -ml-2 mr-1">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              {step === "categories" ? "Escolha uma Categoria" : selectedCategory?.name}
            </DialogTitle>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-xl bg-background border-2 focus-visible:ring-primary/20"
            />
            {search && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] p-2">
          <div className="grid grid-cols-1 gap-1">
            {step === "categories" ? (
              filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className="w-full text-left px-4 py-4 rounded-2xl hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-between group"
                >
                  <span className="font-bold text-sm">{category.name}</span>
                  <div className="flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase font-bold tracking-widest">{category.professions.length} Opções</span>
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))
            ) : (
              displayedProfessions.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => {
                    onSelect(prof.id, prof.name);
                    setSelectedName(prof.name);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-4 rounded-2xl transition-all flex items-center justify-between group",
                    currentProfessionId === prof.id 
                      ? "bg-primary text-primary-foreground shadow-lg" 
                      : "hover:bg-primary/5 hover:text-primary"
                  )}
                >
                  <span className="font-bold text-sm tracking-tight">{prof.name}</span>
                  {currentProfessionId === prof.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <ChevronRight className="h-4 w-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  )}
                </button>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
