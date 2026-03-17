"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

export default function VerifyAgePage() {
  const { update } = useSession();
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) return;

    setLoading(true);
    try {
      const res = await fetch("/api/user/verify-age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Idade verificada com sucesso!");
        await update(); // Atualiza a sessão no cliente
        router.push("/");
        router.refresh();
      } else {
        toast.error(data.error || "Erro ao verificar idade");
      }
    } catch (error) {
      toast.error("Ocorreu um erro inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md border-2 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 bg-primary/5 pb-8 pt-10 text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 text-primary">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">Verificação de Idade</CardTitle>
          <CardDescription className="text-base font-medium">
            Você deve ter pelo menos 18 anos para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-bold uppercase tracking-widest opacity-70">
                Data de Nascimento
              </Label>
              <Input
                id="birthDate"
                type="date"
                required
                className="h-12 rounded-xl border-2 focus:ring-primary shadow-sm"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-bold rounded-full transition-all shadow-lg active:scale-95"
              disabled={loading}
            >
              {loading ? "Verificando..." : "Confirmar e Acessar"}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
              Ao continuar, você confirma que as informações prestadas são verdadeiras e que possui idade legal conforme as leis locais.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
