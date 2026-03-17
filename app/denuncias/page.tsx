"use client";

import { useState, useEffect, useCallback } from "react";
import { DenunciaCard } from "@/components/DenunciaCard";
import { DenunciaForm } from "@/components/DenunciaForm";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle } from "lucide-react";

export default function DenunciasPage() {
  const { data: realSession } = useSession();
  const isDev = process.env.NODE_ENV === "development";
  const session = isDev
    ? { user: { id: "dev-user", name: "Dev Admin", email: "dev@dev.com", role: "ADMIN" } }
    : realSession;
  const [denuncias, setDenuncias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDenuncias = useCallback(async () => {
    try {
      const res = await fetch("/api/denuncias");
      const data = await res.json();
      setDenuncias(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDenuncias();
  }, [fetchDenuncias]);

  const currentUserId = isDev ? "dev-user" : (session?.user as any)?.id;

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="h-7 w-7 text-yellow-500" />
          <h1 className="text-3xl font-bold tracking-tight">Denúncias</h1>
        </div>
        <p className="text-muted-foreground">
          Registre problemas e irregularidades na cidade. As denúncias mais votadas aparecem primeiro.
        </p>
      </div>

      {session?.user && (
        <div className="mb-8">
          <DenunciaForm onCreated={fetchDenuncias} />
        </div>
      )}

      {!session?.user && (
        <div className="mb-8 p-4 border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-900 rounded-lg text-sm text-center text-muted-foreground">
          Faça login para enviar uma denúncia ou reagir às existentes.
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-lg" />
          ))
        ) : denuncias.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhuma denúncia ainda.</p>
            <p className="text-sm">Seja o primeiro a reportar um problema.</p>
          </div>
        ) : (
          denuncias.map((d) => (
            <DenunciaCard key={d.id} denuncia={d} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </div>
  );
}
