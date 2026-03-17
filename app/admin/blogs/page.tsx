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
import { BlogRowActions } from "@/components/admin/BlogRowActions";
import { CreateBlogButton } from "@/components/admin/CreateBlogButton";
import { Pagination } from "@/components/admin/Pagination";
import { toast } from "sonner";
import { Rss, Search } from "lucide-react";

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [cidades, setCidades] = useState<any[]>([]);
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
      const [blogsRes, cidadesRes] = await Promise.all([
        fetch(`/api/admin/blogs?page=${page}&limit=${limit}`),
        fetch("/api/admin/cidades"),
      ]);

      if (!blogsRes.ok || !cidadesRes.ok) throw new Error("Erro ao carregar dados");

      const blogsData = await blogsRes.json();
      const cidadesData = await cidadesRes.json();

      setBlogs(blogsData.blogs);
      setTotal(blogsData.total);
      setTotalPages(blogsData.totalPages);
      
      // Se cidadesData vier paginado no futuro, precisaremos ajustar. 
      // Por enquanto, o CreateBlogButton espera a lista completa.
      setCidades(cidadesData.cidades || cidadesData); 
    } catch (error) {
      toast.error("Erro ao carregar blogs");
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    b.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Gestão de Blogs
            </h1>
            <p className="text-slate-500 font-medium">
              {total} fontes conectadas no total.
            </p>
          </div>
          <div className="flex gap-4 items-center">
             <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar fontes..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CreateBlogButton cidades={cidades} />
          </div>
        </header>

        <div className="border rounded-[2rem] bg-background overflow-hidden shadow-xl shadow-slate-200/50">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b-2 hover:bg-slate-50">
                <TableHead className="font-black text-[10px] uppercase tracking-widest h-14 pl-8">Fonte</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">Cidade</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">URL RSS</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest h-14 pr-8">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">
                    Carregando fontes...
                  </TableCell>
                </TableRow>
              ) : filteredBlogs.map((blog: any) => (
                <TableRow key={blog.id} className="hover:bg-blue-50/50 transition-colors border-slate-50 h-20">
                  <TableCell className="pl-8">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                        <Rss className="h-4 w-4" />
                      </div>
                      <span className="font-black text-slate-700 uppercase tracking-tight">{blog.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold uppercase text-[9px] px-3">
                      {blog.cidade?.nome || "VCA"}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 italic">
                      {blog.rssUrl}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <BlogRowActions blog={blog} cidades={cidades} />
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredBlogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Nenhuma fonte encontrada.
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
