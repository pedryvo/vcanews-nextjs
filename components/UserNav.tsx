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
import { LogOut, LayoutDashboard, LogIn, User as UserIcon, Settings, MessageSquare } from "lucide-react";
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

  if (status === "loading") {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  // Se não estiver logado, exibe o botão Entrar
  if (status === "unauthenticated" || !session) {
    return (
      <Button 
        variant="default" 
        size="sm" 
        onClick={handleLogin}
        className="rounded-full gap-2 font-black tracking-widest bg-yellow-400 hover:bg-yellow-500 text-black border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all shadow-lg"
      >
        <LogIn className="h-4 w-4" />
        LOGIN
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* Texto de saudação para confirmar que o login funcionou */}
      <div className="hidden sm:flex flex-col items-end">
        <span className="text-xs font-bold leading-none">
          {(session as any)?.user?.name}
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-tighter">
          {(session as any)?.user?.role || "user"}
        </span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 border-2 border-primary/10 hover:border-primary/30 transition-all overflow-hidden">
            <Avatar className="h-full w-full">
              <AvatarImage src={(session as any)?.user?.image || ""} alt={(session as any)?.user?.name || ""} />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {(session as any)?.user?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
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
            onClick={() => signOut()}
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
