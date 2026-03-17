"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { CidadeForm } from "@/components/admin/CidadeForm";
import { DeleteDialog } from "@/components/admin/DeleteDialog";

interface CidadeRowActionsProps {
  cidade: {
    id: number;
    nome: string;
  };
}

export function CidadeRowActions({ cidade }: CidadeRowActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-end gap-2">
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Cidade</DialogTitle>
          </DialogHeader>
          <CidadeForm 
            initialData={cidade} 
            onSuccess={() => setIsEditOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <DeleteDialog
        isOpen={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Excluir Cidade"
        description={`Tem certeza que deseja excluir a cidade "${cidade.nome}"? Esta ação não pode ser desfeita.`}
        deleteUrl={`/api/admin/cidades/${cidade.id}`}
      />
    </>
  );
}
