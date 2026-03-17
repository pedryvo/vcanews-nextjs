"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu, MessageSquare, ShoppingBag, User as UserIcon, Settings, LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { NavItem } from "./NavItem";
import { Separator } from "@/components/ui/separator";

export function SidebarMenu() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const user = session?.user;
  const pathname = usePathname();

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      setOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      window.dispatchEvent(new CustomEvent("refresh-news"));
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-muted">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 border-r-0 bg-background flex flex-col">
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle asChild className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-2 pr-1">
            <Link href="/" onClick={handleLogoClick}>
              <span className="text-primary italic">VCA</span>NEWS
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-4 mb-2">Atividade</p>
            <NavItem 
              href="/mensagens" 
              label="Minhas Mensagens" 
              icon={MessageSquare} 
              variant="sidebar" 
              onClick={() => setOpen(false)} 
            />
            <NavItem 
              href="/user/meus-anuncios" 
              label="Gerenciar Anúncios" 
              icon={ShoppingBag} 
              variant="sidebar" 
              onClick={() => setOpen(false)} 
            />
            <NavItem 
              href={user?.username ? `/user/${user.username}` : "/settings/profile"} 
              label="Meu Perfil" 
              icon={UserIcon} 
              variant="sidebar" 
              onClick={() => setOpen(false)} 
            />
          </div>

          <Separator className="mx-4 opacity-50" />

          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 px-4 mb-2">Conta</p>
            <NavItem 
              href="/settings/profile" 
              label="Configurações" 
              icon={Settings} 
              variant="sidebar" 
              onClick={() => setOpen(false)} 
            />
          </div>

          {user?.role === "ADMIN" && (
            <>
              <Separator className="mx-4 opacity-50" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 px-4 mb-2">Admin</p>
                <NavItem 
                  href="/admin" 
                  label="Painel Administrativo" 
                  icon={LayoutDashboard} 
                  variant="sidebar" 
                  onClick={() => setOpen(false)} 
                />
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t mt-auto">
          {session ? (
            <Button 
              variant="destructive" 
              className="w-full rounded-xl gap-2 font-bold"
              onClick={() => {
                signOut({ callbackUrl: "/" });
                setOpen(false);
              }}
            >
              <LogOut className="h-4 w-4" />
              Sair da Conta
            </Button>
          ) : (
            <Button className="w-full rounded-xl font-bold" onClick={() => (window.location.href = "/auth/signin")}>
              Entrar Agora
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
