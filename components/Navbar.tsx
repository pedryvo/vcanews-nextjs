"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Mail } from "lucide-react"
import { UserNav } from "@/components/UserNav"
import { NotificationMenu } from "@/components/NotificationMenu"
import { WeatherWidget } from "@/components/WeatherWidget"

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("clear-news"));
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => {
        window.location.reload();
      }, 300);
    }
  };

  const navLinks = [
    {
      href: "/denuncias",
      label: "DENÚNCIAS DA CIDADE",
      className: "bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-600",
    },
    {
      href: "/profissionais",
      label: "PROFISSIONAIS DE VCA",
      className: "bg-blue-600 hover:bg-blue-700 text-white border-blue-800",
    },
    {
      href: "/compra-e-venda",
      label: "COMPRA E VENDA",
      className: "bg-orange-500 hover:bg-orange-600 text-white border-orange-700",
    },
    {
      href: "/contato",
      label: "FALE CONOSCO",
      className: "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700",
    },
  ];

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

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] font-black px-4 py-2 rounded-md transition-all uppercase tracking-tight shadow-lg border-b-4 active:border-b-0 active:translate-y-0.5 ${link.className}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            <WeatherWidget />
            <NotificationMenu />
            <UserNav />
          </div>

          {/* Toggle Mobile Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Collapse) */}
      {isOpen && (
        <div className="md:hidden border-t bg-white animate-in slide-in-from-top duration-300">
          <div className="flex flex-col p-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-center text-xs font-black px-4 py-4 rounded-xl transition-all uppercase tracking-tight shadow-md border-b-4 active:border-b-0 active:translate-y-0.5 ${link.className}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center justify-around py-2 border-t mt-2">
              <NotificationMenu />
              <UserNav />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
