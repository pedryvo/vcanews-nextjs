"use client";

import Link from "next/link";
import { SidebarMenu } from "./SidebarMenu";
import { NotificationMenu } from "@/components/NotificationMenu";
import { UserDropdown } from "./UserDropdown";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <SidebarMenu />
        <Link href="/" className="flex items-center gap-1.5 focus:outline-none">
          <img src="/logo.svg" alt="VCA Logo" className="h-6 w-auto" />
          <span className="text-lg font-black italic uppercase tracking-tighter pr-1">
            <span className="text-primary">VCA</span>NEWS
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-1">
        <NotificationMenu />
        <UserDropdown className="h-8 w-8" align="end" />
      </div>
    </header>
  );
}

