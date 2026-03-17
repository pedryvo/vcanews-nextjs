"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, ImagePlus, X } from "lucide-react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { createDenuncia } from "@/actions/denuncia-actions";

interface DenunciaFormProps {
  onCreated?: () => void;
}

export function DenunciaForm({ onCreated }: DenunciaFormProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [success, setSuccess] = useState<"admin" | "pending" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { upload, loading } = useImageUpload();

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Upload photo first if selected using the hook
      let imageUrl: string | null = null;
      if (file) {
        imageUrl = await upload(file, "denuncias");
      }

      // Use Server Action instead of fetch
      const result = await createDenuncia({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        imageUrl
      });

      setTitulo("");
      setDescricao("");
      setFile(null);
      setPreview(null);
      setSuccess(result.isAdmin ? "admin" : "pending");
      onCreated?.();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro de rede. Tente novamente.";
      setError(message);
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

