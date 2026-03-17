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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nome: z.string().min(2, {
    message: "O nome deve ter pelo menos 2 caracteres.",
  }),
  rssUrl: z.string().url({
    message: "Insira uma URL de RSS válida.",
  }),
  cidadeId: z.string().min(1, {
    message: "Selecione uma cidade.",
  }),
});

interface BlogFormProps {
  cidades: { id: number; nome: string }[];
  initialData?: {
    id: number;
    nome: string;
    rssUrl: string;
    cidadeId: number;
  };
  onSuccess?: () => void;
}

export function BlogForm({ cidades, initialData, onSuccess }: BlogFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
      ? { 
          nome: initialData.nome, 
          rssUrl: initialData.rssUrl, 
          cidadeId: initialData.cidadeId.toString() 
        }
      : {
          nome: "",
          rssUrl: "",
          cidadeId: "",
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...values,
        cidadeId: parseInt(values.cidadeId),
      };

      const response = await fetch(
        initialData ? `/api/admin/blogs/${initialData.id}` : "/api/admin/blogs",
        {
          method: initialData ? "PATCH" : "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar blog.");

      toast.success(initialData ? "Blog atualizado!" : "Blog criado!");
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
              <FieldLabel htmlFor="blog-nome">Nome do Blog</FieldLabel>
              <Input 
                {...field} 
                id="blog-nome" 
                placeholder="Ex: Blog do Anderson" 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="rssUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="blog-rss">URL do RSS</FieldLabel>
              <Input 
                {...field} 
                id="blog-rss" 
                placeholder="https://exemplo.com/feed" 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="cidadeId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="blog-cidade">Cidade</FieldLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger id="blog-cidade" className="bg-background">
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {cidades.map((cidade) => (
                    <SelectItem key={cidade.id} value={cidade.id.toString()}>
                      {cidade.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="w-full h-10 rounded-full font-bold">
        {initialData ? "Salvar Alterações" : "Criar Blog"}
      </Button>
    </form>
  );
}
