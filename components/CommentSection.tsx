"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  denunciaId: string;
}

export function CommentSection({ denunciaId }: CommentSectionProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/denuncias/${denunciaId}/comments`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [denunciaId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || posting) return;

    setPosting(true);
    try {
      const res = await fetch(`/api/denuncias/${denunciaId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment }),
      });

      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [...prev, comment]);
        setNewComment("");
      }
    } finally {
      setPosting(false);
    }
  }

  const isDev = process.env.NODE_ENV === "development";
  const displayForm = isDev || !!session;

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4 border-t">
      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        <MessageSquare className="h-4 w-4" />
        Comentários ({comments.length})
      </div>

      <div className="max-h-64 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-sm text-center text-muted-foreground py-4 italic">
            Ninguém comentou ainda. Seja o primeiro!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarImage src={comment.user.image || ""} />
                <AvatarFallback className="text-[10px]">
                  {comment.user.name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted/30 p-3 rounded-2xl">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold">{comment.user.name || "Usuário"}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {displayForm ? (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Escreva um comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[40px] max-h-32 rounded-xl text-sm"
            rows={1}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={posting || !newComment.trim()} 
            className="shrink-0 h-10 w-10 rounded-xl"
          >
            {posting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      ) : (
        <div className="p-3 bg-muted/50 rounded-xl text-center">
           <p className="text-xs text-muted-foreground font-medium">Faça login para comentar.</p>
        </div>
      )}
    </div>
  );
}
