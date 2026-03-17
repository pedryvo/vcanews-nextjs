import Link from "next/link";
import { 
  Building2, 
  Rss, 
  Newspaper, 
  LayoutDashboard,
  ChevronRight,
  AlertTriangle
} from "lucide-react";

import { SyncButton } from "./SyncButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Cidades", href: "/admin/cidades", icon: Building2 },
    { name: "Blogs", href: "/admin/blogs", icon: Rss },
    { name: "Notícias", href: "/admin/posts", icon: Newspaper },
    { name: "Denúncias", href: "/admin/denuncias", icon: AlertTriangle },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-lg font-semibold tracking-tight">Backoffice</h2>
        </div>
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground group"
            >
              <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
              {item.name}
              <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t">
          <SyncButton />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
