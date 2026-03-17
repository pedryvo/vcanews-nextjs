"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileFooter() {
  const pathname = usePathname();
  const router = useRouter();

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      
      // 1. Limpar a lista (através de evento customizado para o componente NewsTimeline)
      window.dispatchEvent(new CustomEvent("clear-news"));
      
      // 2. Ir para o topo
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // 3. Recarregar as notícias (reload da página)
      setTimeout(() => {
        window.location.reload();
      }, 300); // 300ms para dar tempo do scroll suave começar e o usuário ver a lista sumindo
    }
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
      <div className="container mx-auto px-4 h-16 flex items-center justify-around">
        <Link 
          href="/" 
          onClick={handleHomeClick}
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Home className="h-6 w-6" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Início</span>
        </Link>

        <Link 
          href="/denuncias"
          className={cn(
            "flex flex-col items-center gap-1 transition-colors",
            pathname === "/denuncias" ? "text-yellow-500" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className={cn(
            "p-2 rounded-full -mt-8 shadow-lg border-4 border-background transition-transform active:scale-95",
            pathname === "/denuncias" ? "bg-yellow-400 text-black" : "bg-muted text-muted-foreground"
          )}>
            <AlertTriangle className="h-7 w-7" />
          </div>
          <span className="text-[10px] font-medium uppercase tracking-wider mt-1">Denúncias</span>
        </Link>
      </div>
    </div>
  );
}
