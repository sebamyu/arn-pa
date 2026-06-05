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
            
            {/* 📍 เปลี่ยนโลโก้เป็นรูปภาพตรงนี้ครับ */}
            <img 
              src="/logo.jpg" 
              alt="อ่านปะ โลโก้" 
              className="h-10 w-10 rounded-full object-cover shadow-sm border-2 border-purple-200 group-hover:scale-110 transition-transform" 
            />
            
            <div className="leading-tight">
              <div className="text-lg font-extrabold gradient-text">Arn Pa อ่านปะ</div>
              <div className="text-[10px] text-muted-foreground">จองปุ๊บ ได้อ่านปั๊บ</div>
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