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
import { CidadeRowActions } from "@/components/admin/CidadeRowActions";
import { CreateCidadeButton } from "@/components/admin/CreateCidadeButton";
import { Pagination } from "@/components/admin/Pagination";
import { toast } from "sonner";
import { Building2, Search } from "lucide-react";

export default function CidadesAdminPage() {
  const [cidades, setCidades] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 50;

  useEffect(() => {
    fetchCidades(currentPage);
  }, [currentPage]);

  const fetchCidades = async (page: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cidades?page=${page}&limit=${limit}`);
      if (!res.ok) throw new Error("Erro ao carregar cidades");
      const data = await res.json();
      setCidades(data.cidades);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error("Erro ao carregar cidades");
    } finally {
      setLoading(false);
    }
  };

  const filteredCidades = cidades.filter((c) =>
    c.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">
              Cidades Atendidas
            </h1>
            <p className="text-slate-500 font-medium">
              {total} cidades cadastradas no sistema.
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar cidades..."
                className="w-full h-12 pl-12 pr-4 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-500 transition-all outline-none font-medium text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CreateCidadeButton />
          </div>
        </header>

        <div className="border rounded-[2rem] bg-background overflow-hidden shadow-xl shadow-slate-200/50">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="border-b-2 hover:bg-slate-50">
                <TableHead className="font-black text-[10px] uppercase tracking-widest h-14 pl-8">ID #</TableHead>
                <TableHead className="font-black text-[10px] uppercase tracking-widest h-14">Nome da Cidade</TableHead>
                <TableHead className="text-right font-black text-[10px] uppercase tracking-widest h-14 pr-8">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-40 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">
                    Carregando cidades...
                  </TableCell>
                </TableRow>
              ) : filteredCidades.map((cidade: any) => (
                <TableRow key={cidade.id} className="hover:bg-blue-50/50 transition-colors border-slate-50 h-20">
                  <TableCell className="pl-8 text-xs font-mono text-slate-400">
                    {cidade.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-black text-slate-700 uppercase tracking-tight">{cidade.nome}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <CidadeRowActions cidade={cidade} />
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredCidades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-40 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                    Nenhuma cidade encontrada.
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
