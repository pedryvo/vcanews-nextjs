import { blogPostRepository } from "@/repositories/blog-post-repository";
export const dynamic = "force-dynamic";
import NewsTimeline from "@/components/NewsTimeline";
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { userRepository } from "@/repositories/user-repository";

import { ProfileCTA, ProfessionalGuideCTA, MarketplaceCTA, DenunciaCTA } from "@/components/HomeCTAs";

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
    const user = await userRepository.getProfileStatus(session.user.email);
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

      <ProfileCTA 
        show={showProfileCTA}
        title={ctaTitle}
        description={ctaDescription}
        link={ctaLink}
        buttonText={ctaButtonText}
      />

      <ProfessionalGuideCTA />

      <MarketplaceCTA session={session} />

      <DenunciaCTA />

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
