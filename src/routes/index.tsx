import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Library, ShieldCheck, Layers, ArrowRight, BookHeart } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "อ่านปะ — จองหนังสือการ์ตูน มังงะ มันฮวา เรียลไทม์" },
      { name: "description", content: "เว็บจองการ์ตูน มังงะ มันฮวา นิยายวาย/ยูริ เรียลไทม์สำหรับวัยรุ่น" },
    ],
  }),
  component: HomePage,
});

const features = [
  { icon: Library, title: "หลายหมวดหมู่", desc: "มังงะ มันฮวา การ์ตูนจีน นิยายวาย/ยูริ" },
  { icon: ShieldCheck, title: "คืนได้ปลอดภัย", desc: "เฉพาะคนจองเท่านั้นที่ยกเลิก/คืนได้" },
  { icon: Layers, title: "API พร้อมเชื่อมต่อ", desc: "เรียกใช้ง่าย พร้อม CORS เปิดให้ทุกระบบ" },
];

function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="relative">
        <div className="glass-strong rounded-[2rem] p-8 md:p-14 text-center overflow-hidden animate-fade-up">
          {/* <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            จองหนังสือ Real-Time
          </div> */}
          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="gradient-text">อ่านปะ</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            จองหนังสือการ์ตูน มังงะ มันฮวา และนิยายเรื่องโปรดของคุณได้แล้ววันนี้
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/books"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-transform"
            >
              <BookHeart className="h-4 w-4" /> เริ่มจองเลย <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/api-docs"
              className="inline-flex items-center gap-2 rounded-2xl bg-white/80 px-6 py-3 text-sm font-semibold text-foreground shadow"
            >
              ดู API
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-12 grid gap-4 md:grid-cols-3">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="glass rounded-2xl p-6 animate-fade-up hover:-translate-y-1 transition-transform"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-pink-200 to-purple-200">
              <f.icon className="h-5 w-5 text-purple-700" />
            </div>
            <h3 className="mt-4 font-bold text-lg">{f.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-12 glass-strong rounded-3xl p-8 md:p-10 text-center animate-fade-up">
        <h2 className="text-2xl md:text-3xl font-bold">พร้อมหยิบเล่มโปรดของคุณหรือยัง?</h2>
        <p className="mt-2 text-sm text-muted-foreground">เลือกหมวด เลือกเล่ม กรอกชื่อ เลือกวันที่ — เสร็จในไม่กี่วินาที</p>
        <Link
          to="/books"
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 px-6 py-3 text-sm font-semibold text-white shadow-lg"
        >
          ไปที่หน้าจอง <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
