"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
});

interface CidadeFormProps {
  initialData?: {
    id: number;
    nome: string;
  };
  onSuccess?: () => void;
}

export function CidadeForm({ initialData, onSuccess }: CidadeFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nome: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        initialData ? `/api/admin/cidades/${initialData.id}` : "/api/admin/cidades",
        {
          method: initialData ? "PATCH" : "POST",
          body: JSON.stringify(values),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar cidade.");

      toast.success(initialData ? "Cidade atualizada!" : "Cidade criada!");
      router.refresh();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Algo deu errado.");
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FieldGroup>
        <Controller
          name="nome"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="cidade-nome">Nome da Cidade</FieldLabel>
              <Input 
                {...field} 
                id="cidade-nome" 
                placeholder="Ex: Vitória da Conquista" 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="w-full">
        {initialData ? "Salvar Alterações" : "Criar Cidade"}
      </Button>
    </form>
  );
}
