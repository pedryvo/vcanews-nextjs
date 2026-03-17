import AdminLayout from "@/components/admin/AdminLayout";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Rss, Newspaper, Users, ShoppingBag, Briefcase, AlertCircle } from "lucide-react";
import { cidadeRepository } from "@/repositories/cidade-repository";
import { blogRepository } from "@/repositories/blog-repository";
import { blogPostRepository } from "@/repositories/blog-post-repository";
import { denunciaRepository } from "@/repositories/denuncia-repository";
import { prisma } from "@/lib/db";

export default async function AdminDashboard() {
  console.log("[DEBUG] AdminDashboard: Iniciando renderização...");
  const isDev = process.env.NODE_ENV === "development";

  const [cidades, blogs, totalPosts, totalUsers, totalAds, totalProfessions, totalDenuncias] = await Promise.all([
    cidadeRepository.getAll(),
    blogRepository.getAll(),
    blogPostRepository.count(),
    (prisma as any).user.count(),
    (prisma as any).ad.count(),
    (prisma as any).user.count({ where: { professionId: { not: null } } }),
    denunciaRepository.count(),
  ]);

  const stats = [
    { name: "Cidades", value: cidades.length, icon: Building2 },
    { name: "Blogs", value: blogs.length, icon: Rss },
    { name: "Notícias", value: totalPosts, icon: Newspaper },
    { name: "Usuários", value: totalUsers, icon: Users },
    { name: "Profissionais", value: totalProfessions, icon: Briefcase },
    { name: "Anúncios", value: totalAds, icon: ShoppingBag },
    { name: "Denúncias", value: totalDenuncias, icon: AlertCircle },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de notícias.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
