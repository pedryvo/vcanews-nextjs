import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import Link from "next/link";

interface AdCardProps {
  ad: any;
}

export function AdCard({ ad }: AdCardProps) {
  const mainImage = ad.images[0]?.url || "/placeholder-ad.jpg";
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(parseFloat(ad.price));

  return (
    <Link href={`/compra-e-venda/${ad.id}`} className="block h-full cursor-pointer">
      <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 rounded-3xl border-2 flex flex-col h-full bg-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img 
            src={mainImage} 
            alt={ad.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-primary text-primary-foreground border-none font-black text-sm px-3 py-1 shadow-lg">
              {formattedPrice}
            </Badge>
          </div>
        </div>
        <CardHeader className="p-5 pb-2">
          <div className="flex items-center gap-2 mb-3">
             <Avatar className="h-6 w-6 border-2 border-background shadow-sm">
               <AvatarImage src={ad.user.image} className="object-cover" />
               <AvatarFallback className="text-[10px] bg-primary text-primary-foreground font-bold">
                 {ad.user.name?.[0]}
               </AvatarFallback>
             </Avatar>
             <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">
               {ad.user.name}
             </span>
          </div>
          <h3 className="font-black uppercase tracking-tighter text-xl leading-none line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {ad.title}
          </h3>
        </CardHeader>
        <CardFooter className="p-5 pt-0 flex justify-between items-center">
          <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest bg-muted/50 hover:bg-muted transition-colors">
            {ad.subcategory.name}
          </Badge>
          <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-tighter">
            {new Date(ad.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
