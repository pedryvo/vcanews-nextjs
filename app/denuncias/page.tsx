"use client";

import { useState, useEffect, useCallback } from "react";
import { DenunciaCard } from "@/components/DenunciaCard";
import { DenunciaForm } from "@/components/DenunciaForm";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, LogIn } from "lucide-react";

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

  const currentUserId = isDev ? "dev-user" : ((session as any)?.user as any)?.id;

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

      {(session as any)?.user && (
        <div className="mb-8">
          <DenunciaForm onCreated={fetchDenuncias} />
        </div>
      )}

      {!(session as any)?.user && (
        <div className="mb-8 flex justify-center">
          <Button 
            onClick={() => signIn("google")}
            size="lg"
            className="w-full py-6 md:py-8 text-sm md:text-lg font-black tracking-widest bg-yellow-400 hover:bg-yellow-500 text-black border-b-4 md:border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all rounded-2xl md:rounded-3xl gap-2 md:gap-4 shadow-2xl"
          >
            <LogIn className="h-6 w-6 md:h-8 md:w-8" />
            FAÇA LOGIN PARA ENVIAR DENÚNCIA
          </Button>
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
