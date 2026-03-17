"use client";

import { useState, useEffect } from "react";
import { Bell, MessageSquare, AlertTriangle, ArrowRight } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSocket } from "@/hooks/use-socket";

export function NotificationMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useSocket();

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications");
    }
  };

  useEffect(() => {
    if (session) {
      fetchNotifications();
    }
  }, [session]);

  useEffect(() => {
    if (socket && session) {
      const channelName = `user-${(session as any).user.id}`;
      const channel = socket.subscribe(channelName);
      
      channel.bind("notification", () => {
        fetchNotifications();
      });

      return () => {
        channel.unbind("notification");
      };
    }
  }, [socket, session]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PATCH" });
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, read: true, unreadCount: 0 })));
    } catch (error) {
      console.error("Failed to mark read");
    }
  };

  if (!session) return null;

  return (
    <DropdownMenu onOpenChange={(open) => open && markAllAsRead()}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full border-2 border-primary/5 hover:bg-primary/5">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-primary text-[10px] font-bold border-2 border-background">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[340px] p-2 rounded-[2rem] shadow-2xl border-2 z-[100] bg-background">
        <DropdownMenuLabel className="font-black uppercase tracking-tighter italic text-xl px-4 py-3 flex items-center justify-between">
          Notificações
          {unreadCount > 0 && <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full not-italic">{unreadCount} NOVAS</span>}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 opacity-50" />
        <ScrollArea className="h-[400px] px-1">
          <div className="space-y-2 py-2">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} asChild className="p-0 rounded-2xl cursor-pointer focus:bg-primary/5 hover:bg-primary/5 border-2 border-transparent transition-all overflow-hidden group outline-none">
                  <Link 
                    href={n.type === "COMMENT" ? `/denuncias/${n.referenceId}` : `/mensagens/${n.referenceId}`} 
                    className={cn(
                      "flex items-stretch w-full min-h-[70px]",
                      n.status === "FINISHED" && "opacity-40 grayscale-[0.5]"
                    )}
                  >
                    {/* Stripe vertical lateral */}
                    <div className={cn(
                      "w-1.5 shrink-0",
                      n.type === "COMMENT" ? "bg-amber-400" : "bg-primary",
                      n.status === "FINISHED" && "bg-muted-foreground"
                    )} />
                    
                    <div className="flex-1 p-3 flex items-center gap-3">
                      {/* Foto miniaturizada */}
                      <Avatar className="h-10 w-10 border-2 border-background shadow-md shrink-0">
                        <AvatarImage src={n.otherUser?.image || ""} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                          {n.otherUser?.name?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <p className="text-xs font-black uppercase tracking-tight truncate group-hover:text-primary transition-colors">
                            {n.otherUser?.name || "Sistema"}
                          </p>
                          {n.unreadCount > 0 && (
                            <Badge variant="default" className="h-4 px-1 rounded-md text-[9px] font-black bg-primary animate-pulse">
                              +{n.unreadCount}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1.5 opacity-60">
                          <div className={cn(
                            "p-1 rounded-md shrink-0",
                            n.type === "COMMENT" ? "bg-amber-400/10 text-amber-600" : "bg-primary/10 text-primary"
                          )}>
                            {n.type === "COMMENT" ? <AlertTriangle className="h-2.5 w-2.5" /> : <MessageSquare className="h-2.5 w-2.5" />}
                          </div>
                          <p className="text-[10px] font-bold truncate">
                            {n.type === "COMMENT" ? "Comentou na denúncia" : "Mensagem no chat"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-[8px] font-black opacity-30 uppercase tracking-tighter">
                          {new Date(n.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-primary" />
                      </div>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="py-20 text-center space-y-3 opacity-20">
                <Bell className="h-12 w-12 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Sem notificações</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function cn(...inputs: any) {
  return inputs.filter(Boolean).join(" ");
}
