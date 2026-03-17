"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTopAndRefresh = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // Dispara o evento de refresh para o NewsTimeline
    window.dispatchEvent(new CustomEvent("refresh-news"));
  };

  return (
    <Button
      variant="default"
      size="icon"
      className={cn(
        "fixed bottom-24 right-6 z-40 h-12 w-12 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-background hidden md:flex",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
      )}
      onClick={scrollToTopAndRefresh}
      title="Voltar ao topo e atualizar"
    >
      <ChevronUp className="h-6 w-6" />
    </Button>
  );
}
