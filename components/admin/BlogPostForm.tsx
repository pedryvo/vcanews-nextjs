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
  titulo: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres.",
  }),
  url: z.string().url({
    message: "Insira uma URL válida.",
  }),
  imageUrl: z.string().url().optional().or(z.literal("")),
  dataPublicacao: z.string().min(1, {
    message: "Selecione uma data.",
  }),
  blogId: z.string().min(1, {
    message: "Selecione um blog.",
  }),
});

interface BlogPostFormProps {
  blogs: { id: number; nome: string }[];
  initialData?: {
    id: number;
    titulo: string;
    url: string;
    imageUrl?: string | null;
    dataPublicacao: Date;
    blogId: number;
  };
  onSuccess?: () => void;
}

export function BlogPostForm({ blogs, initialData, onSuccess }: BlogPostFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData 
      ? { 
          titulo: initialData.titulo,
          url: initialData.url,
          imageUrl: initialData.imageUrl || "",
          dataPublicacao: new Date(initialData.dataPublicacao).toISOString().split("T")[0],
          blogId: initialData.blogId.toString() 
        }
      : {
          titulo: "",
          url: "",
          imageUrl: "",
          dataPublicacao: new Date().toISOString().split("T")[0],
          blogId: "",
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload = {
        ...values,
        blogId: parseInt(values.blogId),
        dataPublicacao: new Date(values.dataPublicacao),
      };

      const response = await fetch(
        initialData ? `/api/admin/posts/${initialData.id}` : "/api/admin/posts",
        {
          method: initialData ? "PATCH" : "POST",
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Erro ao salvar post.");

      toast.success(initialData ? "Post atualizado!" : "Post criado!");
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
          name="titulo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-titulo">Título</FieldLabel>
              <Input 
                {...field} 
                id="post-titulo" 
                placeholder="Título da notícia" 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-url">URL</FieldLabel>
              <Input 
                {...field} 
                id="post-url" 
                placeholder="https://..." 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="imageUrl"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="post-image">URL da Imagem</FieldLabel>
              <Input 
                {...field} 
                id="post-image" 
                placeholder="https://..." 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="dataPublicacao"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="post-data">Data de Publicação</FieldLabel>
                <Input 
                  type="date" 
                  {...field} 
                  id="post-data" 
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="blogId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="post-blog">Blog</FieldLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger id="post-blog" className="bg-background">
                    <SelectValue placeholder="Selecione o blog" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {blogs.map((blog) => (
                      <SelectItem key={blog.id} value={blog.id.toString()}>
                        {blog.nome}
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
        </div>
      </FieldGroup>
      <Button type="submit" className="w-full h-10 rounded-full font-bold">
        {initialData ? "Salvar Alterações" : "Criar Post"}
      </Button>
    </form>
  );
}
