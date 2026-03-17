"use client";

import { useState, useEffect, useRef, use } from "react";
import { useSession } from "next-auth/react";
import { 
  Send, 
  ArrowLeft, 
  Loader2, 
  CheckCircle2, 
  Slash,
  MoreVertical,
  Flag
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSocket } from "@/hooks/use-socket";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export default function ChatRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const router = useRouter();
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socket = useSocket();

  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await fetch(`/api/budgets/${id}/messages`);
        if (res.ok) {
          const data = await res.json();
          setConversation(data);
          setMessages(data.messages);
        } else {
          router.push("/mensagens");
        }
      } catch (error) {
        toast.error("Erro ao carregar chat");
      } finally {
        setLoading(false);
      }
    }
    fetchChat();
  }, [id, router]);

  useEffect(() => {
    if (socket && id) {
      const channel = socket.subscribe(id);

      channel.bind("new-message", (message: Message) => {
        if (message.senderId !== ((session as any)?.user as any)?.id) {
          setMessages((prev) => [...prev, message]);
        }
      });

      channel.bind("conversation-status-updated", (data: any) => {
        if (data.conversationId === id) {
          setConversation((prev: any) => ({ ...prev, status: data.status }));
          if (data.status === "FINISHED") {
            toast.info("Este orçamento foi finalizado.");
          }
        }
      });

      return () => {
        channel.unbind("new-message");
        channel.unbind("conversation-status-updated");
        socket.unsubscribe(id);
      };
    }
  }, [socket, id, session]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/budgets/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

        if (res.ok) {
          const msg = await res.json();
          setMessages((prev) => [...prev, msg]);
          setNewMessage("");
        }
    } catch (error) {
      toast.error("Falha ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const handleFinishConversation = async () => {
    try {
      const res = await fetch(`/api/budgets/${id}/messages`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "FINISHED" }),
      });

      if (res.ok) {
        setConversation((prev: any) => ({ ...prev, status: "FINISHED" }));
        toast.success("Orçamento finalizado!");
      }
    } catch (error) {
      toast.error("Erro ao encerrar");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const otherUser = conversation.senderId === ((session as any)?.user as any)?.id ? conversation.receiver : conversation.sender;
  const isFinished = conversation.status === "FINISHED";

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-muted/30">
      {/* Header do Chat */}
      <header className="bg-background border-b px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <Link href="/mensagens"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border shadow-sm">
              <AvatarImage src={otherUser.image || ""} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {otherUser.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-tight">{otherUser.name}</h2>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                {isFinished ? "Conversa Encerrada" : "Online agora"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isFinished && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleFinishConversation}
              className="hidden md:flex rounded-full border-green-500/20 text-green-600 hover:bg-green-500/10 font-bold uppercase text-[10px] tracking-widest gap-2"
            >
              <CheckCircle2 className="h-3 w-3" />
              Finalizar Orçamento
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl w-48 p-2">
              <DropdownMenuItem onClick={() => router.push(`/user/${otherUser.username}`)} className="rounded-lg gap-3">
                Ver Perfil
              </DropdownMenuItem>
              {!isFinished && (
                <DropdownMenuItem onClick={handleFinishConversation} className="md:hidden rounded-lg gap-3 text-green-600">
                  Finalizar Orçamento
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/user/block/${otherUser.id}`, { method: "POST" });
                    if (res.ok) {
                      toast.success("Usuário bloqueado");
                      router.push("/mensagens");
                    } else {
                      toast.error("Erro ao bloquear");
                    }
                  } catch (e) {
                    toast.error("Erro na conexão");
                  }
                }} 
                className="text-destructive font-bold rounded-lg gap-3"
              >
                <Slash className="h-4 w-4" /> Bloquear Usuário
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-lg gap-3">
                <Flag className="h-4 w-4" /> Denunciar Conversa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Área de Mensagens */}
      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 py-8">
            <Badge variant="outline" className="rounded-full font-mono text-[9px]">CONVERSA INICIADA EM {new Date(conversation.createdAt).toLocaleDateString("pt-BR")}</Badge>
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50">Esta é uma conversa privada sobre um orçamento.</p>
          </div>

          <div className="space-y-4">
            {messages.map((msg, index) => {
              const isMe = msg.senderId === ((session as any)?.user as any)?.id;
              return (
                <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-background border-2 border-muted/50 rounded-tl-none"
                  )}>
                    <p className="leading-relaxed font-medium">{msg.content}</p>
                    <span className={cn(
                      "text-[9px] mt-1 block opacity-50 font-mono",
                      isMe ? "text-right" : "text-left"
                    )}>
                      {new Date(msg.createdAt).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>
        </div>
      </ScrollArea>

      {/* Input de Mensagem */}
      <footer className="p-4 bg-background border-t sticky bottom-0">
        <form 
          onSubmit={handleSendMessage}
          className="max-w-4xl mx-auto flex items-end gap-2"
        >
          {isFinished ? (
            <div className="w-full h-12 bg-muted rounded-2xl flex items-center justify-center border-2 border-dashed border-muted-foreground/20 italic text-muted-foreground text-xs font-bold uppercase tracking-widest">
              Esta conversa foi encerrada.
            </div>
          ) : (
            <>
              <Input 
                placeholder="Escreva sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
                className="flex-1 h-12 rounded-2xl border-2 focus-visible:ring-primary/20 bg-muted/30"
              />
              <Button 
                type="submit" 
                disabled={!newMessage.trim() || sending}
                className="h-12 w-12 rounded-2xl shadow-lg shadow-primary/20"
              >
                {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </>
          )}
        </form>
      </footer>
    </div>
  );
}
