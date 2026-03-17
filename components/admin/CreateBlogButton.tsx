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
import { BlogForm } from "@/components/admin/BlogForm";

interface CreateBlogButtonProps {
  cidades: { id: number; nome: string }[];
}

export function CreateBlogButton({ cidades }: CreateBlogButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Novo Blog
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background">
        <DialogHeader>
          <DialogTitle>Adicionar Blog</DialogTitle>
        </DialogHeader>
        <BlogForm cidades={cidades} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
