"use client";

import { signIn, signOut, useSession } from "next-auth/react";
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
import { LogOut, LayoutDashboard, LogIn, User as UserIcon, Settings, MessageSquare, ShoppingBag } from "lucide-react";
import Link from "next/link";

export function UserNav() {
  const { data: session, status } = useSession();
  const isDev = process.env.NODE_ENV === "development";

  const handleLogin = () => {
    if (isDev) {
      signIn("credentials", { callbackUrl: "/" });
    } else {
      signIn("google");
    }
  };

  // ... (existing code omitido)

const GoogleIcon = () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.11c-.22-.66-.35-1.36-.35-2.11s.13-1.45.35-2.11V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.83z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
    </svg>
  );

  if (status === "loading") {
    return <div className="h-10 w-24 rounded-full bg-muted animate-pulse" />;
  }

  // Se não estiver logado, exibe o botão Entrar
  if (status === "unauthenticated" || !session) {
    return (
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleLogin}
        className="rounded-full gap-2 px-6 font-black tracking-widest bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-100 shadow-sm transition-all"
      >
        <GoogleIcon />
        LOGIN
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-11 px-2 pr-4 rounded-2xl border-2 border-slate-100 bg-white hover:bg-slate-50 transition-all flex items-center gap-3 group">
            <Avatar className="h-8 w-8 border-2 border-slate-50 shadow-sm">
              <AvatarImage src={(session as any)?.user?.image || ""} alt={(session as any)?.user?.name || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {(session as any)?.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start min-w-[60px]">
                <span className="text-[10px] font-black uppercase tracking-tight text-slate-800 line-clamp-1">
                {(session as any)?.user?.name?.split(' ')[0]}
                </span>
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                {(session as any)?.user?.role || "user"}
                </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        {/* Usando classes explícitas para garantir visibilidade e contraste */}
        <DropdownMenuContent 
          className="w-64 bg-white dark:bg-zinc-950 border-2 shadow-2xl rounded-2xl p-2 z-[100]" 
          align="end"
          sideOffset={8}
        >
          <DropdownMenuLabel className="font-normal p-3 bg-muted/30 rounded-xl mb-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none flex items-center justify-between">
                {(session as any)?.user?.name}
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
                  {(session as any)?.user?.role}
                </span>
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate italic">
                {(session as any)?.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-3 focus:bg-primary/10 focus:text-primary group">
            <Link href="/mensagens" className="flex w-full items-center gap-3 font-semibold">
              <div className="p-2 rounded-lg bg-primary/5 group-focus:bg-primary/20 transition-colors">
                <MessageSquare className="h-4 w-4" />
              </div>
              Minhas Mensagens
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-3 focus:bg-primary/10 focus:text-primary group">
            <Link href="/user/meus-anuncios" className="flex w-full items-center gap-3 font-semibold">
              <div className="p-2 rounded-lg bg-primary/5 group-focus:bg-primary/20 transition-colors">
                <ShoppingBag className="h-4 w-4" />
              </div>
              Gerenciar Anúncios
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-3 focus:bg-primary/10 focus:text-primary group">
            <Link href={(session as any)?.user?.username ? `/user/${(session as any)?.user.username}` : "/settings/profile"} className="flex w-full items-center gap-3 font-semibold">
              <div className="p-2 rounded-lg bg-primary/5 group-focus:bg-primary/20 transition-colors">
                <UserIcon className="h-4 w-4" />
              </div>
              Meu Perfil Público
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-3 focus:bg-primary/10 focus:text-primary group">
            <Link href="/settings/profile" className="flex w-full items-center gap-3 font-semibold">
              <div className="p-2 rounded-lg bg-primary/5 group-focus:bg-primary/20 transition-colors">
                <Settings className="h-4 w-4" />
              </div>
              Configurações
            </Link>
          </DropdownMenuItem>

          {(session as any)?.user?.role === "ADMIN" && (
            <>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem asChild className="cursor-pointer rounded-xl py-3 focus:bg-primary/10 focus:text-primary group">
                <Link href="/admin" className="flex w-full items-center gap-3 font-semibold">
                  <div className="p-2 rounded-lg bg-primary/5 group-focus:bg-primary/20 transition-colors">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  Painel Administrativo
                </Link>
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuItem 
            className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive font-bold rounded-xl py-3 flex items-center gap-3 group" 
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <div className="p-2 rounded-lg bg-destructive/5 group-focus:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            Sair da Conta (Logout)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
