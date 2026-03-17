"use client";

import Link from "next/link";
import { ArrowRight, Briefcase, User as UserIcon, Sparkles, ShoppingBag, AlertTriangle } from "lucide-react";

interface ProfileCTAProps {
  show: boolean;
  title: string;
  description: string;
  link: string;
  buttonText: string;
}

export function ProfileCTA({ show, title, description, link, buttonText }: ProfileCTAProps) {
  if (!show) return null;
  return (
    <Link href={link} className="block mb-6 group">
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
              {title}
            </h3>
          </div>
          <p className="text-rose-800 text-sm font-medium leading-tight">
            {description}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-tighter group-hover:gap-3 transition-all">
          {buttonText} <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
}

export function ProfessionalGuideCTA() {
  return (
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
  );
}

export function MarketplaceCTA({ session }: { session: any }) {
  return (
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
  );
}

export function DenunciaCTA() {
  return (
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
  );
}
