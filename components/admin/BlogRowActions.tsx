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
import { BlogForm } from "@/components/admin/BlogForm";
import { DeleteDialog } from "@/components/admin/DeleteDialog";

interface BlogRowActionsProps {
  blog: {
    id: number;
    nome: string;
    rssUrl: string;
    cidadeId: number;
  };
  cidades: { id: number; nome: string }[];
}

export function BlogRowActions({ blog, cidades }: BlogRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors" asChild>
          <a href={blog.rssUrl} target="_blank" rel="noopener noreferrer">
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
        <DialogContent className="sm:max-w-[500px] bg-background">
          <DialogHeader>
            <DialogTitle>Editar Blog</DialogTitle>
          </DialogHeader>
          <BlogForm 
            cidades={cidades} 
            initialData={blog} 
            onSuccess={() => setIsEditOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Excluir Blog"
        description={`Tem certeza que deseja excluir o blog "${blog.nome}"? Esta ação removerá também todos os posts associados.`}
        deleteUrl={`/api/admin/blogs/${blog.id}`}
      />
    </>
  );
}
