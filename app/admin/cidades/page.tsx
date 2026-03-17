import AdminLayout from "@/components/admin/AdminLayout";
export const dynamic = "force-dynamic";
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
import { CidadeRowActions } from "@/components/admin/CidadeRowActions";
import { CreateCidadeButton } from "@/components/admin/CreateCidadeButton";

export default async function CidadesAdminPage() {
  const cidades = await cidadeRepository.getAll();

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cidades</h1>
            <p className="text-muted-foreground">Gerencie as cidades atendidas pela plataforma.</p>
          </div>
          
          <CreateCidadeButton />
        </div>

        <div className="border rounded-xl bg-background overflow-hidden shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold">ID</TableHead>
                <TableHead className="font-bold">Nome</TableHead>
                <TableHead className="text-right font-bold w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cidades.map((cidade: any) => (
                <TableRow key={cidade.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium text-muted-foreground">#{cidade.id}</TableCell>
                  <TableCell className="font-semibold">{cidade.nome}</TableCell>
                  <TableCell className="text-right">
                    <CidadeRowActions cidade={cidade} />
                  </TableCell>
                </TableRow>
              ))}
              {cidades.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    Nenhuma cidade cadastrada.
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
