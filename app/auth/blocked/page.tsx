"use client";

import { ShieldAlert, LogOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function BlockedPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8 p-10 bg-background border-4 border-destructive/20 rounded-[3rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-destructive animate-pulse" />
        
        <div className="space-y-4">
          <div className="bg-destructive/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-destructive/20 group-hover:scale-110 transition-transform duration-500">
            <ShieldAlert className="h-12 w-12 text-destructive" />
          </div>
          
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Conta <span className="text-destructive">Bloqueada</span></h1>
          
          <p className="text-sm font-medium text-muted-foreground leading-relaxed">
            Sua conta foi suspensa por um administrador devido a violações dos termos de uso da plataforma.
          </p>
        </div>

        <div className="pt-6 space-y-3">
          <Button 
            variant="destructive" 
            className="w-full h-12 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-destructive/20"
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair da Conta
          </Button>
          
          <Button asChild variant="ghost" className="w-full h-12 rounded-2xl font-bold text-xs uppercase tracking-widest">
            <Link href="/">
              <ArrowLeft className="mr-2 h-3 w-3" /> Voltar ao Início
            </Link>
          </Button>
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest opacity-20 pt-4">
          Equipe de Segurança VCA News
        </p>
      </div>
    </div>
  );
}
