import AdminLayout from "@/components/admin/AdminLayout";
import { blogRepository } from "@/repositories/blog-repository";
import { cidadeRepository } from "@/repositories/cidade-repository";
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
import { BlogRowActions } from "@/components/admin/BlogRowActions";
import { CreateBlogButton } from "@/components/admin/CreateBlogButton";
import { Badge } from "@/components/ui/badge";

export default async function BlogsAdminPage() {
  const [blogs, cidades] = await Promise.all([
    blogRepository.getAll(),
    cidadeRepository.getAll(),
  ]);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
            <p className="text-muted-foreground">Gerencie as fontes de notícias RSS.</p>
          </div>
          
          <CreateBlogButton cidades={cidades} />
        </div>

        <div className="border rounded-xl bg-background overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">Nome</TableHead>
                <TableHead className="font-bold">Cidade</TableHead>
                <TableHead className="font-bold">RSS URL</TableHead>
                <TableHead className="text-right font-bold w-[120px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-semibold">{blog.nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {blog.cidade.nome}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs font-mono">
                    {blog.rssUrl}
                  </TableCell>
                  <TableCell className="text-right">
                    <BlogRowActions blog={blog} cidades={cidades} />
                  </TableCell>
                </TableRow>
              ))}
              {blogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    Nenhum blog cadastrado.
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
