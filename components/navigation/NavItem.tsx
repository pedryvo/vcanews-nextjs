"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavItemProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  className?: string;
  activeClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  variant?: "desktop" | "mobile-bottom" | "sidebar";
  highlight?: boolean;
}

export function NavItem({
  href,
  label,
  icon: Icon,
  className,
  activeClassName,
  onClick,
  variant = "desktop",
  highlight = false,
}: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  if (variant === "mobile-bottom") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex flex-col items-center gap-1 transition-all relative",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
          highlight && "scale-110 -translate-y-2",
          className
        )}
      >
        {highlight ? (
          <div className={cn(
            "p-3 rounded-full shadow-lg border-4 border-background transition-transform active:scale-95",
            isActive ? "bg-yellow-400 text-black" : "bg-muted text-muted-foreground"
          )}>
            {Icon && <Icon className="h-6 w-6" />}
          </div>
        ) : (
          Icon && <Icon className="h-6 w-6" />
        )}
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider",
          highlight && "mt-0"
        )}>
          {label}
        </span>
      </Link>
    );
  }

  if (variant === "sidebar") {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all group",
          isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground",
          className
        )}
      >
        {Icon && <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />}
        <span>{label}</span>
      </Link>
    );
  }

  // Default: Desktop
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "text-[11px] font-black px-4 py-2 rounded-md transition-all uppercase tracking-tight shadow-lg border-b-4 active:border-b-0 active:translate-y-0.5",
        isActive ? activeClassName : className
      )}
    >
      {label}
    </Link>
  );
}
