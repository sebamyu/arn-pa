import type { BookWithStatus } from "@/lib/books";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";

export function BookCard({
  book,
  onClick,
  compact = false,
}: {
  book: BookWithStatus;
  onClick: () => void;
  compact?: boolean;
}) {
  const booked = !!book.activeBooking;
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative text-left rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl",
        "glass",
        booked && "opacity-70 grayscale-[30%]",
      )}
    >
      <div
        className={cn(
          "relative aspect-[3/4] w-full bg-gradient-to-br flex items-center justify-center text-6xl",
          book.gradient,
        )}
      >
        <span className="drop-shadow-md">{book.cover_emoji}</span>
        <div className="absolute top-2 left-2">
          <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-purple-700">
            {book.code}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          {booked ? (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
              <Lock className="h-2.5 w-2.5" /> ถูกจองแล้ว
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
              <CheckCircle2 className="h-2.5 w-2.5" /> ว่าง
            </span>
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="text-[10px] text-muted-foreground font-medium">{book.category}</div>
        <div className={cn("font-bold leading-tight line-clamp-2", compact ? "text-sm" : "text-sm md:text-base")}>
          {book.title}
        </div>
        {!compact && <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{book.author}</div>}
      </div>
    </button>
  );
}
