"use client";

import { useState, useRef } from "react";
import { Mail, Send, CheckCircle2, AlertCircle, Info, Target, Heart } from "lucide-react";
import { toast } from "sonner";
import { Turnstile } from "@marsidev/react-turnstile";

export default function ContatoPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, captchaToken }),
      });

      if (!res.ok) throw new Error("Falha ao enviar mensagem");

      toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setCaptchaToken(null);
      captchaRef.current?.reset();
    } catch (error) {
      toast.error("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Lado Esquerdo: Quem Somos */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6 text-balance">
              Quem Somos <span className="text-blue-600">Nós</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              O VCA News nasceu com o propósito de conectar Vitória da Conquista, trazendo informação ágil, denúncias relevantes e agora, o maior guia de profissionais da cidade.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Nossa Missão</h3>
              </div>
              <p className="text-muted-foreground">
                Ser o portal de referência para o cidadão conquistense, unindo voz comunitária e oportunidades profissionais em um só lugar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-rose-100 p-3 rounded-2xl text-rose-600">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Nossos Valores</h3>
              </div>
              <p className="text-muted-foreground">
                Transparência nas denúncias, agilidade na informação e compromisso com o desenvolvimento local.
              </p>
            </div>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">Conectando Ideias</h3>
              <p className="text-blue-50 font-medium mb-6">
                Tem uma sugestão de pauta, uma dúvida ou quer anunciar conosco? Utilize o formulário ao lado e nossa equipe responderá o mais rápido possível.
              </p>
              <div className="flex items-center gap-2 font-bold opacity-80 decoration-none">
              </div>
            </div>
          </div>
        </div>

        {/* Lado Direito: Formulário */}
        <div className="bg-white border-2 border-slate-100 p-8 md:p-12 rounded-[3rem] shadow-2xl relative">
          <div className="absolute top-6 right-8 opacity-10">
            <Send className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-black mb-8 uppercase tracking-tighter">Mande sua Mensagem</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Nome Completo</label>
                <input
                  required
                  type="text"
                  placeholder="Seu nome"
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-300 focus:bg-white transition-all outline-none font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">E-mail</label>
                <input
                  required
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-300 focus:bg-white transition-all outline-none font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Assunto</label>
              <input
                required
                type="text"
                placeholder="Qual o motivo do contato?"
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-300 focus:bg-white transition-all outline-none font-medium"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Mensagem</label>
              <textarea
                required
                rows={5}
                placeholder="Descreva seu contato em detalhes..."
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-300 focus:bg-white transition-all outline-none font-medium resize-none"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="flex justify-center py-2">
              <Turnstile
                ref={captchaRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setCaptchaToken(token)}
                onError={() => setCaptchaToken(null)}
                onExpire={() => setCaptchaToken(null)}
              />
            </div>

            <button
              disabled={loading || !captchaToken}
              type="submit"
              className="w-full h-16 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
            >
              {loading ? (
                "Enviando..."
              ) : (
                <>
                  Enviar Mensagem <Send className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
