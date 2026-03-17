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
import { CidadeForm } from "@/components/admin/CidadeForm";

export function CreateCidadeButton() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg hover:shadow-xl transition-all">
          <Plus className="h-4 w-4 mr-2" />
          Nova Cidade
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Cidade</DialogTitle>
        </DialogHeader>
        <CidadeForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
