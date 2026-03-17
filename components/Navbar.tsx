"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/UserNav"
import { NotificationMenu } from "@/components/NotificationMenu"

export default function Navbar() {
  const pathname = usePathname();

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      
      // 1. Limpar a lista
      window.dispatchEvent(new CustomEvent("clear-news"));
      
      // 2. Ir para o topo
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // 3. Recarregar as notícias (reload da página)
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" onClick={handleHomeClick} className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Vitória da Conquista Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              VCANews
            </span>
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            <Link
              href="/denuncias"
              className="text-xs font-bold px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md transition-all uppercase tracking-tight shadow-sm"
            >
              DENÚNCIAS DA CIDADE
            </Link>
            <Link
              href="/profissionais"
              className="text-xs font-bold px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-all uppercase tracking-tight shadow-sm border border-primary/20"
            >
              PROFISSIONAIS DE VCA
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationMenu />
          <UserNav />
        </div>
      </div>
    </nav>
  )
}
