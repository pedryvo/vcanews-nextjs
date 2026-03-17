"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { CreatePostButton } from "@/components/admin/CreatePostButton";
import { Pagination } from "@/components/admin/Pagination";
import { toast } from "sonner";
import { ImageIcon, Newspaper, Search, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BlogPostsAdminPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 50;

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const [postsRes, blogsRes] = await Promise.all([
        fetch(`/api/admin/posts?page=${page}&limit=${limit}`),
        fetch("/api/admin/blogs"),
      ]);

      if (!postsRes.ok || !blogsRes.ok) throw new Error("Erro ao carregar dados");

      const postsData = await postsRes.json();
      const blogsData = await blogsRes.json();

      setPosts(postsData.posts);
      setTotal(postsData.total);
      setTotalPages(postsData.totalPages);
      setBlogs(blogsData.blogs || blogsData);
    } catch (error) {
      toast.error("Erro ao carregar notícias");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Feed de Notícias
            </h1>
            <p className="text-slate-500 font-medium">
              {total} postagens capturadas no total.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar notícias..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CreatePostButton blogs={blogs} />
          </div>
        </header>

        <div className="border rounded-[2rem] bg-background overflow-hidden shadow-xl shadow-slate-200/50">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b-2 hover:bg-slate-50">
                <TableHead className="font-black text-[10px] uppercase tracking-widest h-14 pl-8">Notícia</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">Origem / Blog</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">Publicação</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest h-14 pr-8">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">
                    Carregando notícias...
                  </TableCell>
                </TableRow>
              ) : filteredPosts.map((post: any) => (
                <TableRow key={post.id} className="hover:bg-blue-50/50 transition-colors border-slate-50 h-24">
                  <TableCell className="pl-8 max-w-[400px]">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-2.5 rounded-2xl text-slate-500 shrink-0 mt-1">
                        <Newspaper className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-black text-slate-700 uppercase tracking-tight line-clamp-2 leading-tight">
                          {post.titulo}
                        </span>
                        <div className="flex items-center gap-2">
                          {post.imageUrl ? (
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter text-emerald-600 border-emerald-100 bg-emerald-50 h-5">
                              <ImageIcon className="h-2.5 w-2.5 mr-1" /> Imagem OK
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-tighter text-slate-400 border-slate-100 bg-slate-50 h-5">
                              <ImageIcon className="h-2.5 w-2.5 mr-1" /> Sem Imagem
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold uppercase text-[9px] px-3">
                      {post.blog.nome}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(post.dataPublicacao), "dd MMM, yyyy", { locale: ptBR })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <PostRowActions post={post} blogs={blogs} />
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Nenhuma notícia encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AdminLayout>
  );
}
