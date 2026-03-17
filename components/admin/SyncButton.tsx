"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SyncButton() {
  const [loading, setLoading] = useState(false);

  async function handleSync() {
    setLoading(true);
    const toastId = toast.loading("Iniciando sincronização...");

    try {
      const response = await fetch("/api/admin/sync", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Erro ao sincronizar");
      }

      toast.success("Sincronização concluída!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Falha ao sincronizar notícias.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleSync}
      disabled={loading}
    >
      <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Sincronizando..." : "Sincronizar Agora"}
    </Button>
  );
}
