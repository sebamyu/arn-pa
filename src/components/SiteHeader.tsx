import { Link, useRouterState } from "@tanstack/react-router";
import { BookHeart, Library, Code2, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "หน้าแรก", icon: Home },
  { to: "/books", label: "จองหนังสือ", icon: Library },
  { to: "/api-docs", label: "API", icon: Code2 },
] as const;

export function SiteHeader() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-3 max-w-6xl px-3">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-2.5">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-pink-300 to-purple-300 text-white shadow-md group-hover:scale-110 transition-transform">
              <BookHeart className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-extrabold gradient-text">อ่านปะ</div>
              <div className="text-[10px] text-muted-foreground">จองหนังสือเรียลไทม์</div>
            </div>
          </Link>
          <nav className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-all",
                    active
                      ? "bg-gradient-to-r from-pink-200 to-purple-200 text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-white/60 hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
