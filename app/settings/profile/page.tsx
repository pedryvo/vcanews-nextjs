"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Camera, 
  Save, 
  Loader2, 
  AtSign, 
  FileText,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Image as ImageIcon,
  Plus,
  Trash2,
  MoveHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfessionSelector } from "@/components/ProfessionSelector";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { ImageCropper } from "@/components/ImageCropper";
import imageCompression from "browser-image-compression";

export default function ProfileSettingsPage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    image: "",
    coverImage: "",
    professionId: "" as string | null,
  });
  const [portfolioImages, setPortfolioImages] = useState<{ id?: string; url: string; order: number }[]>([]);

  const [cropper, setCropper] = useState<{
    open: boolean;
    image: string;
    field: "image" | "coverImage";
    aspect: number;
    title: string;
  }>({
    open: false,
    image: "",
    field: "image",
    aspect: 1,
    title: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    async function fetchProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            name: data.name || "",
            username: data.username || "",
            bio: data.bio || "",
            image: data.image || "",
            coverImage: data.coverImage || "",
            professionId: data.professionId || null,
          });
          setPortfolioImages(data.portfolio || []);
        }
      } catch (error) {
        toast.error("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    }

    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Perfil atualizado com sucesso!");
        await update();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao atualizar perfil");
      }
    } catch (error) {
      toast.error("Erro na conexão");
    } finally {
      setSaving(false);
    }
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>, field: "image" | "coverImage") {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropper({
        open: true,
        image: reader.result as string,
        field,
        aspect: field === "image" ? 1 : 2.5, // Ratio 1:1 para avatar, 2.5:1 para capa reformada
        title: field === "image" ? "Ajustar Foto de Perfil" : "Ajustar Capa do Perfil",
      });
    };
    reader.readAsDataURL(file);
    // Reset individual input so same file can be selected again
    e.target.value = "";
  }

  async function handlePortfolioSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (portfolioImages.length >= 4) {
      toast.error("Você já atingiu o limite de 4 imagens de portfólio.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropper({
        open: true,
        image: reader.result as string,
        field: "portfolio" as any,
        aspect: 4/3,
        title: "Adicionar ao Portfólio (4:3)",
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  async function handleCropComplete(croppedBlob: Blob) {
    if (!croppedBlob) {
      toast.error("Erro ao gerar imagem recortada");
      return;
    }

    setSaving(true);
    setCropper(prev => ({ ...prev, open: false }));

    try {
      // Compressão client-side para economizar storage e banda
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: cropper.field === "image" ? 800 : 1600,
        useWebWorker: true,
        fileType: "image/webp",
      };

      const inputForCompression = new File([croppedBlob], "image.webp", { type: "image/webp" });
      const compressedBlob = await imageCompression(inputForCompression, options);
      
      const finalFile = new File([compressedBlob], `profile-${Date.now()}.webp`, { type: "image/webp" });

      const formDataUpload = new FormData();
      formDataUpload.append("file", finalFile);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        
        if (cropper.field === ("portfolio" as any)) {
          const newImages = [...portfolioImages, { url: data.url, order: portfolioImages.length }];
          setPortfolioImages(newImages);
          // Auto-save portfolio change
          await fetch("/api/user/portfolio", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ images: newImages }),
          });
          toast.success("Imagem adicionada ao portfólio!");
        } else {
          setFormData(prev => ({ ...prev, [cropper.field]: data.url }));
          toast.success(cropper.field === "image" ? "Foto otimizada e pronta!" : "Capa otimizada!");
        }
      } else {
        const errData = await res.json();
        toast.error(errData.error || "Erro no upload da imagem");
      }
    } catch (error: any) {
      console.error("[Crop/Compression Error]", error);
      toast.error("Erro ao processar imagem: " + (error.message || "Tente outra imagem"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar / Preview */}
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-xl bg-gradient-to-b from-primary/5 to-background group">
            {/* Cover Preview in Sidebar */}
            <div className="relative h-24 w-full bg-muted overflow-hidden">
              {formData.coverImage ? (
                <img 
                  src={formData.coverImage} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-primary/5" />
              )}
              <label 
                htmlFor="cover-upload" 
                className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ImageIcon className="h-5 w-5 mr-2" />
                <span className="text-[10px] font-bold uppercase">Alterar Capa</span>
              </label>
              <input 
                id="cover-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleImageSelect(e, "coverImage")}
                disabled={saving}
              />
            </div>

            <CardContent className="p-6 flex flex-col items-center -mt-12 relative z-10">
              <div className="relative group/avatar cursor-pointer w-24 h-24 mb-4">
                <Avatar className="w-full h-full border-4 border-background shadow-lg rounded-full">
                  <AvatarImage src={formData.image || session?.user?.image || ""} className="object-cover" />
                  <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                    {formData.name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <label 
                  htmlFor="photo-upload" 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="h-5 w-5" />
                </label>
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => handleImageSelect(e, "image")}
                  disabled={saving}
                />
              </div>
              <h3 className="font-bold text-lg text-center truncate w-full">{formData.name || "Seu Nome"}</h3>
              <p className="text-xs text-muted-foreground font-mono">@{formData.username || "username"}</p>
              
              <div className="w-full mt-6 pt-6 border-t space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>Perfil Visível</span>
                </div>
                {formData.username && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-[10px] h-8 text-primary hover:bg-primary/5 px-2"
                    onClick={() => router.push(`/user/${formData.username}`)}
                  >
                    <span className="truncate">vcanews.com/user/{formData.username}</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="p-4 bg-muted/30 rounded-2xl border border-muted flex gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              O seu endereço de e-mail nunca é exibido publicamente no seu perfil.
            </p>
          </div>
        </div>

        {/* Formulario Principal */}
        <div className="md:col-span-2">
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-primary/50 to-primary" />
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-black uppercase tracking-tight">Editar Perfil</CardTitle>
              <CardDescription>Customizar sua presença na plataforma.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <User className="h-3 w-3" /> Nome de Exibição
                    </label>
                    <Input 
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Como você quer ser chamado?"
                      className="h-12 rounded-xl bg-muted/20 border-2 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                      <AtSign className="h-3 w-3" /> URL do Perfil (Slug)
                    </label>
                    <div className="relative">
                      <Input 
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="seu-nome-unico"
                        className="h-12 rounded-xl bg-muted/20 border-2 pl-4 focus-visible:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Briefcase className="h-3 w-3" /> Sua Profissão
                  </label>
                  <ProfessionSelector 
                    currentProfessionId={formData.professionId}
                    onSelect={(id) => setFormData(prev => ({ ...prev, professionId: id }))}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <FileText className="h-3 w-3" /> Biografia / Sobre Você
                  </label>
                  <div className="relative">
                    <Textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Conte um pouco sobre suas habilidades e o que você faz..."
                      className="min-h-[120px] rounded-2xl bg-muted/20 border-2 resize-none p-4 focus-visible:ring-primary/20"
                      maxLength={3000}
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] font-bold text-muted-foreground/40 pointer-events-none">
                      {formData.bio.length}/3000
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="w-full h-14 rounded-2xl text-lg font-bold uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-5 w-5" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Galeria de Portfolio */}
          {formData.professionId && (
            <Card className="mt-8 border-none shadow-2xl rounded-3xl overflow-hidden">
              <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500" />
              <CardHeader>
                <CardTitle className="text-2xl font-black uppercase tracking-tight flex items-center justify-between">
                  Galeria & Portfólio
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-none font-mono">
                    {portfolioImages.length}/4
                  </Badge>
                </CardTitle>
                <CardDescription>Mostre seus 4 melhores trabalhos para os clientes (Proporção 4:3).</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {portfolioImages.map((img, idx) => (
                    <div key={img.id || idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden group border-2 border-muted hover:border-emerald-200 transition-all shadow-md">
                      <img src={img.url} className="w-full h-full object-cover" alt="Trabalho" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8 rounded-full"
                          onClick={async () => {
                            const newImages = portfolioImages.filter((_, i) => i !== idx);
                            setPortfolioImages(newImages);
                            await fetch("/api/user/portfolio", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ images: newImages }),
                            });
                            toast.success("Removido com sucesso");
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {portfolioImages.length < 4 && (
                    <label className="aspect-[4/3] rounded-2xl border-2 border-dashed border-muted hover:border-emerald-400 hover:bg-emerald-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 text-muted-foreground group">
                      <Plus className="h-8 w-8 group-hover:scale-125 transition-transform text-emerald-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Foto</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handlePortfolioSelect} 
                        disabled={saving}
                      />
                    </label>
                  )}
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl flex items-start gap-3">
                  <div className="bg-white p-1 rounded-full text-emerald-500 shrink-0">
                    <ImageIcon className="h-4 w-4" />
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium leading-tight">
                    Dica: use fotos reais dos seus serviços. Imagens na horizontal (4:3) ficam melhores no slider do seu perfil público.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {cropper.open && (
        <ImageCropper
          image={cropper.image}
          aspect={cropper.aspect}
          title={cropper.title}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropper(prev => ({ ...prev, open: false }))}
        />
      )}
    </div>
  );
}
