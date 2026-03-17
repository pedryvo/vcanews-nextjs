"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageCropper } from "@/components/ImageCropper";
import { Camera, X, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";

interface AdFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  ad?: any;
  apiUrl?: string;
}

export function AdForm({ onSuccess, onCancel, ad, apiUrl }: AdFormProps) {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: ad?.title || "",
    description: ad?.description || "",
    price: ad?.price || "",
    categoryId: ad?.subcategory?.categoryId || "",
    subcategoryId: ad?.subcategoryId || "",
    images: ad?.images?.map((img: any) => img.url) || [],
  });

  const [cropper, setCropper] = useState<{
    open: boolean;
    image: string;
  }>({ open: false, image: "" });

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (formData.images.length >= 3) {
        toast.error("Máximo de 3 fotos atingido");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCropper({ open: true, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (blob: Blob) => {
    setCropper({ open: false, image: "" });
    setLoading(true);
    try {
      const compressedFile = await imageCompression(new File([blob], "image.webp", { type: "image/webp" }), {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });

      const uploadData = new FormData();
      uploadData.append("file", compressedFile);

      const res = await fetch("/api/upload", { method: "POST", body: uploadData });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, images: [...prev.images, data.url].slice(0, 3) }));
        toast.success("Foto adicionada!");
      } else {
        toast.error("Erro no upload");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar imagem");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) return toast.error("Adicione pelo menos uma foto");
    if (!formData.subcategoryId || formData.subcategoryId === "all") return toast.error("Selecione uma subcategoria");

    setLoading(true);
    try {
      const defaultUrl = ad ? `/api/marketplace/${ad.id}` : "/api/marketplace";
      const res = await fetch(apiUrl || defaultUrl, {
        method: ad ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(ad ? "Anúncio atualizado!" : "Seu anúncio será revisado e publicado em breve!");
        onSuccess();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao salvar anúncio");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Upload de Fotos */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Fotos do Produto (Máx 3)</label>
          <div className="grid grid-cols-3 gap-4">
            {formData.images.map((url: string, i: number) => (
              <div key={i} className="relative aspect-[4/3] rounded-2xl overflow-hidden border-2 border-primary/20 group animate-in zoom-in-95 duration-200">
                <img src={url} className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive shadow-lg"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {formData.images.length < 3 && (
              <label className="relative aspect-[4/3] rounded-2xl border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 hover:border-primary/50 transition-all group">
                <Camera className="h-8 w-8 text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:text-primary transition-all" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-2 group-hover:text-primary transition-all">Upload</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">O que você está vendendo?</label>
          <Input 
            required
            className="h-12 rounded-2xl border-2 font-bold placeholder:font-normal focus-visible:ring-primary/20 transition-all" 
            placeholder="Ex: Play 5 com 2 controles"
            value={formData.title}
            onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Categoria</label>
            <Select 
              value={formData.categoryId} 
              onValueChange={val => setFormData(prev => ({ ...prev, categoryId: val, subcategoryId: "" }))}
            >
              <SelectTrigger className="h-12 rounded-2xl border-2 font-bold focus:ring-primary/20 transition-all">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2">
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Subcategoria</label>
            <Select 
              value={formData.subcategoryId} 
              disabled={!formData.categoryId}
              onValueChange={val => setFormData(prev => ({ ...prev, subcategoryId: val }))}
            >
              <SelectTrigger className="h-12 rounded-2xl border-2 font-bold focus:ring-primary/20 transition-all">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-2">
                {selectedCategory?.subcategories.map((sub: any) => (
                  <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Preço Justo (R$)</label>
          <Input 
            required
            type="number"
            step="0.01"
            className="h-12 rounded-2xl border-2 font-bold placeholder:font-normal focus-visible:ring-primary/20 transition-all" 
            placeholder="0,00"
            value={formData.price}
            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Descrição do Produto</label>
          <Textarea 
            required
            className="rounded-2xl border-2 font-bold min-h-[120px] placeholder:font-normal focus-visible:ring-primary/20 transition-all" 
            placeholder="Detalhe o estado do produto, tempo de uso, etc."
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-12 rounded-2xl border-2 font-black uppercase tracking-widest hover:bg-muted transition-all">
          Cancelar
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5 mr-2" />}
          {ad ? "Salvar" : "Publicar"}
        </Button>
      </div>

      {cropper.open && (
        <ImageCropper 
          image={cropper.image} 
          aspect={4/3} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setCropper({ open: false, image: "" })}
          title="Cortar Foto do Produto"
        />
      )}
    </form>
  );
}
