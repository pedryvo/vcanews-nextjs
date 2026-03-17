"use client";

import Link from "next/link";
import { NavItem } from "./NavItem";
import { WeatherWidget } from "@/components/WeatherWidget";
import { NotificationMenu } from "@/components/NotificationMenu";
import { UserDropdown } from "./UserDropdown";
import { ModeToggle } from "@/components/ModeToggle";

import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  
  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("refresh-news"));
    }
  };

  const navLinks = [
    {
      href: "/denuncias",
      label: "DENÚNCIAS DA CIDADE",
      className: "bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-600",
      activeClassName: "bg-yellow-500 text-black border-yellow-700 translate-y-0.5 border-b-0",
    },
    {
      href: "/profissionais",
      label: "PROFISSIONAIS DE VCA",
      className: "bg-blue-600 hover:bg-blue-700 text-white border-blue-800",
      activeClassName: "bg-blue-700 text-white border-blue-900 translate-y-0.5 border-b-0",
    },
    {
      href: "/compra-e-venda",
      label: "COMPRA E VENDA",
      className: "bg-orange-500 hover:bg-orange-600 text-white border-orange-700",
      activeClassName: "bg-orange-600 text-white border-orange-800 translate-y-0.5 border-b-0",
    },
    {
      href: "/contato",
      label: "FALE CONOSCO",
      className: "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-700",
      activeClassName: "bg-emerald-600 text-white border-emerald-800 translate-y-0.5 border-b-0",
    },
  ];

  return (
    <nav className="hidden md:block border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" onClick={handleLogoClick} className="flex items-center space-x-2">
            <img src="/logo.svg" alt="VCA News Logo" className="h-8 w-auto" />
            <span className="text-2xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent italic uppercase tracking-tighter pr-1">
              VCANews
            </span>
          </Link>

          <div className="flex gap-3 items-center">
            {navLinks.map((link) => (
              <NavItem 
                key={link.href} 
                {...link} 
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <WeatherWidget />
            <ModeToggle />
            <NotificationMenu />
            <UserDropdown />
          </div>
        </div>
      </div>
    </nav>
  );
}

