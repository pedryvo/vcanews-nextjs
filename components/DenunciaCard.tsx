"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type User = { id: string; name: string | null; image: string | null };
type Reaction = { id: string; type: string; user: User };

interface DenunciaCardProps {
  denuncia: {
    id: string;
    titulo: string;
    descricao: string;
    imageUrl?: string | null;
    createdAt: string;
    user: User;
    reactions: Reaction[];
  };
  currentUserId?: string;
}

export function DenunciaCard({ denuncia, currentUserId }: DenunciaCardProps) {
  const [reactions, setReactions] = useState<Reaction[]>(denuncia.reactions);
  const [showReactions, setShowReactions] = useState(false);
  const [loading, setLoading] = useState(false);

  const likes = reactions.filter((r) => r.type === "LIKE");
  const unlikes = reactions.filter((r) => r.type === "UNLIKE");
  const myReaction = currentUserId
    ? reactions.find((r) => r.user.id === currentUserId)?.type
    : null;
  const score = likes.length - unlikes.length;

  async function react(type: "LIKE" | "UNLIKE" | null) {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/denuncias/${denuncia.id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: myReaction === type ? null : type }),
      });
      if (res.ok) {
        const data = await res.json();
        const action = data.action;
        setReactions((prev) => {
          const withoutMe = prev.filter((r) => r.user.id !== currentUserId);
          if (action === "removed" || myReaction === type) return withoutMe;
          return [
            ...withoutMe,
            {
              id: data.reaction.id,
              type: type!,
              user: { id: currentUserId, name: "Você", image: null },
            },
          ];
        });
      }
    } finally {
      setLoading(false);
    }
  }

  const dateStr = new Date(denuncia.createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-semibold text-base leading-snug">{denuncia.titulo}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Avatar className="h-5 w-5">
                <AvatarImage src={denuncia.user.image ?? ""} />
                <AvatarFallback className="text-[10px]">
                  {denuncia.user.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {denuncia.user.name ?? "Anônimo"} · {dateStr}
              </span>
            </div>
          </div>
          <Badge
            variant={score > 0 ? "default" : score < 0 ? "destructive" : "secondary"}
            className="shrink-0"
          >
            {score > 0 ? "+" : ""}
            {score}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{denuncia.descricao}</p>

        {denuncia.imageUrl && (
          <div className="rounded-lg overflow-hidden border">
            <img
              src={denuncia.imageUrl}
              alt="Foto da denúncia"
              className="w-full object-cover"
            />
          </div>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={myReaction === "LIKE" ? "default" : "outline"}
            className="gap-1.5 h-8"
            onClick={() => react("LIKE")}
            disabled={loading || !currentUserId}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{likes.length}</span>
          </Button>
          <Button
            size="sm"
            variant={myReaction === "UNLIKE" ? "destructive" : "outline"}
            className="gap-1.5 h-8"
            onClick={() => react("UNLIKE")}
            disabled={loading || !currentUserId}
          >
            <ThumbsDown className="h-3.5 w-3.5" />
            <span>{unlikes.length}</span>
          </Button>

          {reactions.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1 h-8 text-xs text-muted-foreground ml-auto"
              onClick={() => setShowReactions((v) => !v)}
            >
              {showReactions ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              Ver reações
            </Button>
          )}
        </div>

        {showReactions && (
          <div className="space-y-2 border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reações</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {reactions.map((r) => (
                <div key={r.id} className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={r.user.image ?? ""} />
                    <AvatarFallback className="text-[10px]">{r.user.name?.[0] ?? "?"}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs truncate">{r.user.name ?? "Anônimo"}</span>
                  <span className="ml-auto text-base" title={r.type}>
                    {r.type === "LIKE" ? "👍" : "👎"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
