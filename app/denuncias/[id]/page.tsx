"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DenunciaCard } from "@/components/DenunciaCard";
import Link from "next/link";

export default function DenunciaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [denuncia, setDenuncia] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDenuncia() {
      try {
        const res = await fetch(`/api/denuncias/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDenuncia(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDenuncia();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!denuncia) {
    return (
      <div className="container py-20 text-center space-y-4">
        <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 opacity-20" />
        <h1 className="text-2xl font-black uppercase tracking-tighter">Denúncia não encontrada</h1>
        <Button asChild variant="outline" className="rounded-2xl">
          <Link href="/denuncias">Voltar para Denúncias</Link>
        </Button>
      </div>
    );
  }

  const currentUserId = ((session as any)?.user as any)?.id;

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl space-y-6">
      <Button asChild variant="ghost" className="rounded-full gap-2 text-muted-foreground hover:text-foreground">
        <Link href="/denuncias">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Denúncias
        </Link>
      </Button>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <DenunciaCard 
          denuncia={denuncia} 
          currentUserId={currentUserId} 
        />
      </div>
      
      <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10 text-center">
         <p className="text-[10px] font-black uppercase tracking-widest text-primary/60">
           Esta é a visualização detalhada da denúncia #{denuncia.id.slice(-6).toUpperCase()}
         </p>
      </div>
    </div>
  );
}
