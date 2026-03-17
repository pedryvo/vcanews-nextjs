"use client";

import { signOut, useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LogOut, 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  MessageSquare, 
  ShoppingBag,
  History
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  className?: string;
  align?: "start" | "center" | "end";
}

export function UserDropdown({ className, align = "end" }: UserDropdownProps) {
  const { data: session, status } = useSession();
  const isDev = process.env.NODE_ENV === "development";

  if (status === "loading") {
    return <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />;
  }

  if (status === "unauthenticated" || !session) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => isDev ? signIn("credentials", { callbackUrl: "/" }) : signIn("google")}
        className="rounded-full font-bold uppercase tracking-tight"
      >
        Entrar
      </Button>
    );
  }

  const user = session.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={cn("relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all", className)}>
          <Avatar className="h-full w-full">
            <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-64 p-2 rounded-2xl shadow-2xl border-2 z-[100] bg-background" 
        align={align}
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal p-3 bg-muted/30 rounded-xl mb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none flex items-center justify-between">
              {user?.name}
              {user?.role === "ADMIN" && (
                <span className="text-[9px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-black">
                  ADMIN
                </span>
              )}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="my-1 opacity-50" />
        
        <div className="p-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-2 py-1">Atividade</p>
          <DropdownItem href="/mensagens" icon={MessageSquare} label="Minhas Mensagens" />
          <DropdownItem href="/user/meus-anuncios" icon={ShoppingBag} label="Gerenciar Anúncios" />
          <DropdownItem href={user?.username ? `/user/${user.username}` : "/settings/profile"} icon={UserIcon} label="Meu Perfil Público" />
        </div>

        <DropdownMenuSeparator className="my-1 opacity-50" />
        
        <div className="p-1 space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-2 py-1">Conta</p>
          <DropdownItem href="/settings/profile" icon={Settings} label="Configurações" />
        </div>

        {user?.role === "ADMIN" && (
          <>
            <DropdownMenuSeparator className="my-1 opacity-50" />
            <div className="p-1 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary/50 px-2 py-1">Admin</p>
              <DropdownItem href="/admin" icon={LayoutDashboard} label="Painel Administrativo" />
            </div>
          </>
        )}
        
        <DropdownMenuSeparator className="my-1 opacity-50" />
        
        <DropdownMenuItem 
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold rounded-xl py-3 flex items-center gap-3 transition-colors" 
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sair da Conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DropdownItem({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-2.5 focus:bg-primary/10 focus:text-primary transition-all group">
      <Link href={href} className="flex w-full items-center gap-3 font-semibold">
        <Icon className="h-4 w-4 opacity-70 group-hover:scale-110 transition-transform" />
        {label}
      </Link>
    </DropdownMenuItem>
  );
}
