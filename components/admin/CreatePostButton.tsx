"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";

interface CreatePostButtonProps {
  blogs: { id: number; nome: string }[];
}

export function CreatePostButton({ blogs }: CreatePostButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>Adicionar Postagem</DialogTitle>
        </DialogHeader>
        <BlogPostForm blogs={blogs} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
