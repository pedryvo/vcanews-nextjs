"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    // Reduzido ao mínimo para não atrasar o redirecionamento real
    await new Promise(resolve => setTimeout(resolve, 50));
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md border-2 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 bg-primary/5 pb-8 pt-10 text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight">VCA News</CardTitle>
          <CardDescription className="text-base">
            Entre na sua conta para acessar o Painel Admin
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 p-8">
          <Button 
            className="w-full h-12 text-lg font-bold rounded-full gap-3 border-2 hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
            onClick={handleSignIn}
            disabled={isLoading}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar com Google
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isLoading} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[400px] border-none bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center py-12 outline-none">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full animate-pulse" />
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin relative z-10" />
          </div>
          <DialogTitle className="text-2xl font-black text-slate-800 uppercase tracking-tighter text-center">
            Conectando...
          </DialogTitle>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">
            Preparando seu acesso ao VCA News
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
