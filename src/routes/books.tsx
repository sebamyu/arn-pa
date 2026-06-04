import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, type Book, type BookWithStatus, type Booking } from "@/lib/books";
import { BookCard } from "@/components/BookCard";
import { BookingDialog } from "@/components/BookingDialog";
import { Flame, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/books")({
  head: () => ({
    meta: [
      { title: "จองหนังสือ — อ่านปะ" },
      { name: "description", content: "เลือกหนังสือเรื่องโปรดและจองได้ทันที สถานะอัปเดตเรียลไทม์" },
    ],
  }),
  component: BooksPage,
});

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("ทั้งหมด");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<BookWithStatus | null>(null);

  async function refetch() {
    const [bRes, bkRes] = await Promise.all([
      supabase.from("books").select("*").order("created_at", { ascending: true }),
      supabase.from("bookings").select("*").is("returned_at", null),
    ]);
    if (bRes.data) setBooks(bRes.data as Book[]);
    if (bkRes.data) setBookings(bkRes.data as Booking[]);
    setLoading(false);
  }

  useEffect(() => {
    refetch();
    const ch = supabase
      .channel("realtime-bookings")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        refetch();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "books" }, () => {
        refetch();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const withStatus: BookWithStatus[] = useMemo(() => {
    const map = new Map(bookings.map((b) => [b.book_id, b]));
    return books.map((b) => ({ ...b, activeBooking: map.get(b.id) ?? null }));
  }, [books, bookings]);

  const trending = withStatus.filter((b) => b.is_trending).slice(0, 5);

  const filtered = withStatus.filter((b) => {
    if (category !== "ทั้งหมด" && b.category !== category) return false;
    if (search && !`${b.title} ${b.author}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          <span className="gradient-text">เลือกเล่มที่อยากอ่าน</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          คลิกที่ปกเพื่อดูสถานะ ถ้าว่าง จองได้เลย ถ้าไม่ว่าง รอเจ้าของตัวจริงคืนก่อนนะ
        </p>
      </div>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mt-7">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-pink-500" />
            <h2 className="text-lg font-bold">ฮิตที่สุดตอนนี้</h2>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3">
            {trending.map((b) => (
              <BookCard key={b.id} book={b} onClick={() => setSelected(b)} compact />
            ))}
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="mt-8 glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อเรื่อง / ผู้แต่ง..."
            className="pl-9 bg-white/80 border-white/80"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                category === c
                  ? "bg-gradient-to-r from-pink-300 to-purple-300 text-white shadow"
                  : "bg-white/80 text-foreground hover:bg-white",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="mt-6">
        {loading ? (
          <div className="text-center text-muted-foreground py-12">กำลังโหลด...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">ไม่พบหนังสือในหมวดนี้</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((b) => (
              <BookCard key={b.id} book={b} onClick={() => setSelected(b)} />
            ))}
          </div>
        )}
      </section>

      <BookingDialog
        book={selected}
        onClose={() => setSelected(null)}
        onChanged={refetch}
      />
    </div>
  );
}
