import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BackgroundFx } from "@/components/BackgroundFx";
import { Toaster } from "@/components/ui/sonner";

// 📍 เพิ่มการเรียกใช้งานคอมโพเนนต์แชทบอทและลูกเล่นบับเบิ้ลลอย
import { BotnoiChat } from "@/components/BotnoiChat";
import { FloatingEffects } from "@/components/FloatingEffects";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-7xl font-extrabold gradient-text">404</h1>
        <h2 className="mt-4 text-xl font-semibold">ไม่พบหน้านี้</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          ลิงก์อาจหมดอายุ หรือพิมพ์ URL ผิด
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-pink-300 to-purple-300 px-5 py-2 text-sm font-semibold text-white shadow"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="glass-strong max-w-md rounded-3xl p-10 text-center">
        <h1 className="text-xl font-semibold">หน้านี้โหลดไม่สำเร็จ</h1>
        <p className="mt-2 text-sm text-muted-foreground">เกิดข้อผิดพลาด ลองอีกครั้งดู</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-xl bg-gradient-to-r from-pink-300 to-purple-300 px-4 py-2 text-sm font-semibold text-white shadow"
          >
            ลองใหม่
          </button>
          <a href="/" className="rounded-xl border bg-white px-4 py-2 text-sm font-medium">
            หน้าแรก
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Arn pa อ่านปะ — จองหนังสือการ์ตูน" },
      { name: "description", content: "จองการ์ตูน มังงะญี่ปุ่น มันฮวาเกาหลี การ์ตูนจีน นิยายวาย/ยูริ แบบเรียลไทม์ ทุกคนเห็นพร้อมกัน" },
      { property: "og:title", content: "Arn pa อ่านปะ — จองหนังสือการ์ตูน" },
      { property: "og:description", content: "จองการ์ตูน มังงะญี่ปุ่น มันฮวาเกาหลี การ์ตูนจีน นิยายวาย/ยูริ แบบเรียลไทม์ ทุกคนเห็นพร้อมกัน" },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "Arn pa อ่านปะ — จองหนังสือการ์ตูน" },
      { name: "twitter:description", content: "จองการ์ตูน มังงะญี่ปุ่น มันฮวาเกาหลี การ์ตูนจีน นิยายวาย/ยูริ แบบเรียลไทม์ ทุกคนเห็นพร้อมกัน" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d4b96ed1-953b-4a8b-a586-98006a348e40/id-preview-681c3c36--a8a4e2e4-e2fd-49a9-b074-c2340ea9da0d.lovable.app-1780546220153.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/d4b96ed1-953b-4a8b-a586-98006a348e40/id-preview-681c3c36--a8a4e2e4-e2fd-49a9-b074-c2340ea9da0d.lovable.app-1780546220153.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundFx />
      
      {/* เรียกใช้งานลูกเล่นบับเบิ้ลลอยฟุ้ง */}
      <FloatingEffects />

      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
      <Toaster position="top-center" richColors />
      
      {/* เรียกใช้งาน BotnoiChat */}
      <BotnoiChat />
      
    </QueryClientProvider>
  );
}