"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  deleteUrl: string;
  onSuccess?: () => void;
}

export function DeleteDialog({
  isOpen,
  onOpenChange,
  title,
  description,
  deleteUrl,
  onSuccess,
}: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onDelete() {
    try {
      setLoading(true);
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir.");

      toast.success("Excluído com sucesso!");
      router.refresh();
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Não foi possível excluir.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
            disabled={loading}
          >
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
