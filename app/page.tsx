import { blogPostRepository } from "@/repositories/blog-post-repository";
export const dynamic = "force-dynamic";
import NewsTimeline from "@/components/NewsTimeline";
import { newsSyncService } from "@/services/news-sync-service";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from "next/link";
import { AlertTriangle, ArrowRight, Briefcase, User as UserIcon, Sparkles, ShoppingBag } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";

export default async function Home() {
  const initialNews = await blogPostRepository.getLatest(12);
  const session = await getServerSession(authOptions as any) as any;

  let showProfileCTA = false;
  let ctaTitle = "Crie seu Perfil Profissional";
  let ctaDescription = "Apareça no nosso guia para ser encontrado por clientes e receber orçamentos directos via chat!";
  let ctaLink = "/settings/profile";
  let ctaButtonText = "Configurar Agora";

  if (!session) {
    showProfileCTA = true;
    ctaTitle = "Seja um Profissional VCA";
    ctaDescription = "Faça login agora mesmo e crie o seu perfil profissional para oferecer seus serviços na cidade!";
    ctaLink = "/auth/signin";
    ctaButtonText = "Começar Agora";
  } else if (session?.user?.email) {
    const user = await (prisma as any).user.findUnique({
      where: { email: session.user.email },
      select: { professionId: true, username: true }
    });
    // Se o usuário está logado mas não tem profissão ou username definido, mostramos o CTA
    if (user && (!user.professionId || !user.username)) {
      showProfileCTA = true;
      ctaDescription = "Você ainda não aparece no nosso guia! Complete seu perfil para ser encontrado por clientes.";
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Analytics />
      <SpeedInsights />
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

      {showProfileCTA && (
        <Link href={ctaLink} className="block mb-6 group">
          <div className="bg-rose-50 hover:bg-rose-100 p-6 rounded-[2rem] border-2 border-rose-200 shadow-sm transition-all flex items-center gap-6 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="bg-rose-600 text-white p-3 rounded-2xl shadow-lg">
              <UserIcon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-rose-600 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full tracking-widest flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Essencial
                </span>
                <h3 className="text-sm font-black uppercase tracking-widest text-rose-900">
                  {ctaTitle}
                </h3>
              </div>
              <p className="text-rose-800 text-sm font-medium leading-tight">
                {ctaDescription}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-tighter group-hover:gap-3 transition-all">
              {ctaButtonText} <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      )}

      <Link href="/profissionais" className="block mb-6 group">
        <div className="bg-blue-50 hover:bg-blue-100 p-6 rounded-[2rem] border-2 border-blue-200 shadow-sm transition-all flex items-center gap-6 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-lg">
            <Briefcase className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-600 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full tracking-widest animate-pulse">
                NOVO
              </span>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-900">
                Guia de Profissionais VCA
              </h3>
            </div>
            <p className="text-blue-800 text-sm font-medium leading-tight">
              Encontre os melhores prestadores de serviço da cidade, veja portfólios e peça orçamentos via chat agora mesmo!
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-tighter group-hover:gap-3 transition-all">
            Explorar <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      <Link href={session ? "/compra-e-venda?create=true" : "/compra-e-venda"} className="block mb-6 group">
        <div className="bg-orange-50 hover:bg-orange-100 p-6 rounded-[2rem] border-2 border-orange-200 shadow-sm transition-all flex items-center gap-6 overflow-hidden relative group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="bg-orange-500 text-white p-3 rounded-2xl shadow-lg">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-orange-500 text-[10px] font-black uppercase text-white px-2 py-0.5 rounded-full tracking-widest">
                MARKETPLACE
              </span>
              <h3 className="text-sm font-black uppercase tracking-widest text-orange-900">
                Desapegue e Fature
              </h3>
            </div>
            <p className="text-orange-800 text-sm font-medium leading-tight">
              Tem algo parado em casa? Crie um anúncio agora e venda para milhares de pessoas em nossa cidade!
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-tighter group-hover:gap-3 transition-all">
            {session ? "Anunciar Agora" : "Ver Marketplace"} <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

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
