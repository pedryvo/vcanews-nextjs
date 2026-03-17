import { blogPostRepository } from "@/repositories/blog-post-repository";
export const dynamic = "force-dynamic";
import NewsTimeline from "@/components/NewsTimeline";
import { newsSyncService } from "@/services/news-sync-service";

export default async function Home() {
  // Sincronização passiva: verifica e sincroniza se necessário (sem travar o render)
  newsSyncService.checkAndSync().catch(console.error);

  const initialNews = await blogPostRepository.getLatest(12);

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-balance">
            Últimas Notícias em Vitória da Conquista
          </h1>
          <p className="text-xl text-muted-foreground">
            Acompanhe o que os principais blogs da cidade estão reportando.
          </p>
        </div>
      </header>

      {initialNews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl">
          <p className="text-xl font-medium mb-4">Ainda não há notícias sincronizadas.</p>
          <p className="text-muted-foreground mb-8">Novas notícias serão sincronizadas automaticamente em breve.</p>
        </div>
      ) : (
        <NewsTimeline initialPosts={initialNews} />
      )}
    </div>
  );
}
