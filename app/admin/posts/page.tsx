import AdminLayout from "@/components/admin/AdminLayout";
import { blogPostRepository } from "@/repositories/blog-post-repository";
import { blogRepository } from "@/repositories/blog-repository";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { CreatePostButton } from "@/components/admin/CreatePostButton";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function BlogPostsAdminPage() {
  const [posts, blogs] = await Promise.all([
    blogPostRepository.getAll(),
    blogRepository.getAll(),
  ]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notícias</h1>
            <p className="text-muted-foreground">Gerencie as postagens capturadas.</p>
          </div>
          
          <CreatePostButton blogs={blogs} />
        </div>

        <div className="border rounded-xl bg-background overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Título</TableHead>
                <TableHead className="font-bold">Blog</TableHead>
                <TableHead className="font-bold">Data</TableHead>
                <TableHead className="text-right font-bold w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="max-w-[300px]">
                    <div className="flex flex-col gap-1">
                        <span className="font-semibold line-clamp-1">{post.titulo}</span>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            {post.imageUrl ? (
                                <span className="flex items-center gap-1 text-green-600">
                                    <ImageIcon className="h-3 w-3" /> Imagem OK
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-amber-600">
                                    <ImageIcon className="h-3 w-3" /> Sem Imagem
                                </span>
                            )}
                        </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {post.blog.nome}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(post.dataPublicacao).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-right">
                    <PostRowActions post={post} blogs={blogs} />
                  </TableCell>
                </TableRow>
              ))}
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhuma notícia cadastrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
