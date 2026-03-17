"use client";

import { useState } from "react";

export function useImageUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function compressImage(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const MAX = 900;
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

  async function upload(file: File, folder: string = "uploads"): Promise<string | null> {
    setLoading(true);
    setError(null);
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", new File([compressed], "photo.webp", { type: "image/webp" }));
      form.append("folder", folder);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro ao fazer upload");
      }
      const data = await res.json();
      return data.url;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido ao fazer upload";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { upload, loading, error };
}
