"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, ImagePlus, X } from "lucide-react";

interface DenunciaFormProps {
  onCreated?: () => void;
}

export function DenunciaForm({ onCreated }: DenunciaFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<"admin" | "pending" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setError("Apenas imagens são aceitas.");
      return;
    }
    setError(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function removeFile() {
    setFile(null);
    setPreview(null);
  }

  /** Comprime a imagem no browser usando Canvas antes de fazer upload */
  async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 900; // px máximo em qualquer dimensão
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          const ratio = Math.min(MAX / width, MAX / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Falha ao comprimir imagem"));
          },
          "image/webp",
          0.78,
        );
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  async function uploadImage(): Promise<string | null> {
    if (!file) return null;
    const compressed = await compressImage(file);
    const form = new FormData();
    form.append("file", new File([compressed], "photo.webp", { type: "image/webp" }));
    const res = await fetch("/api/upload", { method: "POST", body: form });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Erro ao fazer upload da imagem");
    }
    const data = await res.json();
    return data.url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload photo first if selected
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await uploadImage();
      }

      const res = await fetch("/api/denuncias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao, imageUrl }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao criar denúncia");
        return;
      }

      setTitulo("");
      setDescricao("");
      setFile(null);
      setPreview(null);
      setSuccess(data.isAdmin ? "admin" : "pending");
      onCreated?.();
    } catch (err: any) {
      setError(err.message ?? "Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📢 Nova Denúncia</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Título da denúncia"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            maxLength={120}
          />
          <Textarea
            placeholder="Descreva o problema com o máximo de detalhes possível..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            rows={4}
            className="resize-none"
          />

          {/* Image Upload */}
          <div>
            {preview ? (
              <div className="relative rounded-lg overflow-hidden border">
                <img src={preview} alt="Prévia" className="w-full max-h-48 object-cover" />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Será convertida para WebP
                </div>
              </div>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
                <ImagePlus className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Adicionar foto (opcional)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {success === "pending" && (
            <div className="flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-md p-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Sua denúncia foi enviada! Ela será publicada em breve após ser aprovada. ✅
            </div>
          )}

          {success === "admin" && (
            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-md p-3">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Denúncia criada e publicada imediatamente! 🚀
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {file ? "Enviando foto..." : "Enviando..."}
              </>
            ) : (
              "Enviar Denúncia"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
