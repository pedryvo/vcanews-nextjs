"use client";

import { Home, Megaphone, ShoppingBag, Users, User } from "lucide-react";
import { NavItem } from "./NavItem";

export function BottomNavigation() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe h-20">
      <nav className="container mx-auto px-4 h-full flex items-center justify-between">
        <NavItem 
          href="/" 
          label="Início" 
          icon={Home} 
          variant="mobile-bottom" 
        />
        
        <NavItem 
          href="/denuncias" 
          label="Denúncias" 
          icon={Megaphone} 
          variant="mobile-bottom" 
          highlight={true}
        />

        <NavItem 
          href="/compra-e-venda" 
          label="Anúncios" 
          icon={ShoppingBag} 
          variant="mobile-bottom" 
        />

        <NavItem 
          href="/profissionais" 
          label="Profs" 
          icon={Users} 
          variant="mobile-bottom" 
        />

        <NavItem 
          href="/settings/profile" 
          label="Perfil" 
          icon={User} 
          variant="mobile-bottom" 
        />
      </nav>
    </div>
  );
}

