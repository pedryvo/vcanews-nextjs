import { blogPostRepository } from "@/repositories/blog-post-repository";
export const dynamic = "force-dynamic";
import NewsTimeline from "@/components/NewsTimeline";
import { newsSyncService } from "@/services/news-sync-service";
import { Analytics } from "@vercel/analytics/next"
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default async function Home() {
  const initialNews = await blogPostRepository.getLatest(12);

  return (
    <div className="container mx-auto py-8 px-4">
      <Analytics />
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

      <Link href="/denuncias" className="block mb-12 group">
        <div className="bg-yellow-400 hover:bg-yellow-500 text-black p-6 md:p-10 rounded-[2rem] shadow-xl transition-all transform hover:scale-[1.01] flex items-center justify-between gap-6 border-b-8 border-yellow-600">
          <div className="flex items-center gap-4 md:gap-8">
            <div className="bg-black text-yellow-400 p-3 md:p-5 rounded-2xl shadow-inner">
              <AlertTriangle className="h-8 w-8 md:h-12 md:w-12" />
            </div>
            <div>
              <p className="text-lg md:text-2xl font-black uppercase tracking-tight opacity-70 leading-none mb-1">
                Problemas na cidade?
              </p>
              <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                ADICIONE AGORA A SUA DENÚNCIA <span className="underline decoration-black/30 underline-offset-4">CLICANDO AQUI</span>
              </h2>
            </div>
          </div>
          <div className="hidden md:flex bg-black/10 p-4 rounded-full group-hover:bg-black/20 transition-colors">
            <ArrowRight className="h-10 w-10 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Link>

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
