"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, ExternalLink } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { DeleteDialog } from "@/components/admin/DeleteDialog";

interface PostRowActionsProps {
  post: {
    id: number;
    titulo: string;
    url: string;
    imageUrl?: string | null;
    dataPublicacao: Date;
    blogId: number;
  };
  blogs: { id: number; nome: string }[];
}

export function PostRowActions({ post, blogs }: PostRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
          <a href={post.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px] bg-background">
          <DialogHeader>
            <DialogTitle>Editar Postagem</DialogTitle>
          </DialogHeader>
          <BlogPostForm 
            blogs={blogs} 
            initialData={post} 
            onSuccess={() => setIsEditOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Excluir Postagem"
        description={`Tem certeza que deseja excluir a notícia "${post.titulo}"?`}
        deleteUrl={`/api/admin/posts/${post.id}`}
      />
    </>
  );
}
