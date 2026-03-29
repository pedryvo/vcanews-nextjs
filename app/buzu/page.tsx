import * as React from "react";
import { fetchBusLines } from "@/lib/bus";
import { BusDashboard } from "@/components/buzu/BusDashboard";
import { Bus, MapPin, Navigation, Info } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VcaBuzu - Itinerários e Horários de Ônibus",
  description: "Consulte os horários e itinerários atualizados de todos os ônibus de Vitória da Conquista de forma fácil e rápida.",
};

export default async function BuzuPage() {
  const lines = await fetchBusLines();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden bg-primary/5 py-16 mb-8 border-b border-muted">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-secondary/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="bg-primary/10 p-3 rounded-2xl text-primary animate-bounce">
              <Bus size={40} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              VcaBuzu
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
              Horários e Itinerários atualizados do transporte público de Vitória da Conquista.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Navigation size={16} className="text-primary" />
                <span>Rotas Oficiais</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                <span>Dados em Tempo Real</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20 overflow-x-hidden">
        <BusDashboard initialLines={lines} />
        
        {/* Footer Info Section */}
        <div className="mt-16 p-6 rounded-2xl bg-muted/30 border border-muted/50 flex flex-col md:flex-row items-center gap-6">
            <div className="p-4 bg-background rounded-xl shadow-sm">
                <Info className="text-primary" size={24} />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h4 className="font-semibold text-foreground mb-1">Sobre os dados</h4>
                <p className="text-sm text-muted-foreground">
                    Os dados exibidos nesta página são obtidos diretamente da API oficial da prefeitura de Vitória da Conquista (VodeBuzu). Os horários refletem a programação oficial.
                </p>
            </div>
            <div className="w-full md:w-auto">
                <a 
                    href="https://vodebuzu.pmvc.ba.gov.br/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold transition-all text-muted-foreground uppercase tracking-widest text-center"
                >
                    Site Oficial ↗
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}
