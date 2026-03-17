import AdminLayout from "@/components/admin/AdminLayout";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Rss, Newspaper } from "lucide-react";
import { cidadeRepository } from "@/repositories/cidade-repository";
import { blogRepository } from "@/repositories/blog-repository";
import { blogPostRepository } from "@/repositories/blog-post-repository";

export default async function AdminDashboard() {
  const [cidades, blogs, posts] = await Promise.all([
    cidadeRepository.getAll(),
    blogRepository.getAll(),
    blogPostRepository.getLatest(5),
  ]);

  const stats = [
    { name: "Cidades", value: cidades.length, icon: Building2 },
    { name: "Blogs", value: blogs.length, icon: Rss },
    { name: "Notícias", value: posts.length, icon: Newspaper }, // Isso é apenas o 'top', mas serve pra dashboard
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema de notícias.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
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
