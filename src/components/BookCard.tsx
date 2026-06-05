import { useState, useEffect, useRef } from "react";
import type { BookWithStatus } from "@/lib/books";
import { cn } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";

const FETCH_TIMEOUT_MS = 3500;

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
  const [imageUrl, setImageUrl] = useState<string | null>(book.imageUrl || null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;
    if (book.imageUrl) {
      setImageUrl(book.imageUrl);
      return;
    }

    const cacheKey = `anime-img-${book.title}`;
    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        setImageUrl(cached);
        return;
      }
    } catch {}

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    (async () => {
      try {
        const res = await fetch(
          `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(book.title)}&limit=1`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("non-ok");
        const data = await res.json();
        const url: string | undefined = data?.data?.[0]?.images?.webp?.image_url;
        if (cancelled.current) return;
        if (url) {
          setImageUrl(url);
          try { sessionStorage.setItem(cacheKey, url); } catch {}
        } else {
          setImgFailed(true);
        }
      } catch {
        if (!cancelled.current) setImgFailed(true);
      } finally {
        clearTimeout(timer);
      }
    })();

    return () => {
      cancelled.current = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [book.title, book.imageUrl]);

  const showFallback = !imageUrl || imgFailed || !imgLoaded;

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
          "relative aspect-[3/4] w-full bg-gradient-to-br flex items-center justify-center text-6xl overflow-hidden",
          book.gradient,
        )}
      >
        {imageUrl && !imgFailed && (
          <img
            src={imageUrl}
            alt={book.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgFailed(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              imgLoaded ? "opacity-100" : "opacity-0",
            )}
          />
        )}

        {showFallback && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-0">
            <span className="text-6xl drop-shadow-md">{book.cover_emoji}</span>
            <span className="text-[10px] font-medium text-white/80 px-2 text-center line-clamp-1">
              {book.title}
            </span>
          </div>
        )}

        <div className="absolute top-2 left-2 z-20">
          <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-purple-700 shadow-sm">
            {book.code}
          </span>
        </div>

        <div className="absolute top-2 right-2 z-20">
          {booked ? (
            <span className="flex items-center gap-1 rounded-full bg-rose-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Lock className="h-2.5 w-2.5" /> ถูกจองแล้ว
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
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
