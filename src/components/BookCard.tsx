// import { useState, useEffect } from "react";
// import type { BookWithStatus } from "@/lib/books"; 
// import { cn } from "@/lib/utils";
// import { CheckCircle2, Lock } from "lucide-react";

// export function BookCard({
//   book,
//   onClick,
//   compact = false,
// }: {
//   book: BookWithStatus;
//   onClick: () => void;
//   compact?: boolean;
// }) {
//   const booked = !!book.activeBooking;
//   const [imageUrl, setImageUrl] = useState<string | null>(book.imageUrl || null);
//   const [imgLoaded, setImgLoaded] = useState(false);

//   useEffect(() => {
//     if (book.imageUrl || imageUrl) return;

//     const cacheKey = `anime-img-${book.title}`;
//     const cachedImg = sessionStorage.getItem(cacheKey);
    
//     if (cachedImg) {
//       setImageUrl(cachedImg);
//       return;
//     }

//     // เพิ่มระบบ Retry: ถ้ายิงแล้วโดนบล็อก ให้พยายามใหม่สูงสุด 3 ครั้ง
//     const fetchImage = async (retryCount = 0) => {
//       try {
//         const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(book.title)}&limit=1`);
        
//         // ถ้าติด Rate Limit (429) ให้รอสักพักแล้วลองใหม่
//         if (res.status === 429 && retryCount < 3) {
//           const retryDelay = 2000 + Math.random() * 3000; // รอ 2-5 วินาที
//           setTimeout(() => fetchImage(retryCount + 1), retryDelay);
//           return;
//         }

//         const data = await res.json();
//         const fetchedUrl = data?.data?.[0]?.images?.webp?.image_url;
        
//         if (fetchedUrl) {
//           setImageUrl(fetchedUrl);
//           sessionStorage.setItem(cacheKey, fetchedUrl);
//         }
//       } catch (err) {
//         console.error("Failed to fetch image:", book.title);
//       }
//     };

//     // กระจายเวลาเริ่มโหลดรูปตั้งแต่ 0 ถึง 4 วินาที (ไม่ให้แย่งกันโหลด)
//     const initialDelay = Math.random() * 4000;
//     const timeout = setTimeout(() => fetchImage(0), initialDelay);

//     return () => clearTimeout(timeout);
//   }, [book.title, book.imageUrl, imageUrl]);

//   return (
//     <button
//       onClick={onClick}
//       className={cn(
//         "group relative text-left rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl",
//         "glass",
//         booked && "opacity-70 grayscale-[30%]"
//       )}
//     >
//       <div
//         className={cn(
//           "relative aspect-[3/4] w-full bg-gradient-to-br flex items-center justify-center text-6xl overflow-hidden",
//           book.gradient
//         )}
//       >
//         {imageUrl && (
//           <img
//             src={imageUrl}
//             alt={book.title}
//             onLoad={() => setImgLoaded(true)}
//             className={cn(
//               "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
//               imgLoaded ? "opacity-100" : "opacity-0"
//             )}
//           />
//         )}

//         <span className={cn("drop-shadow-md z-10", imgLoaded && "hidden")}>
//           {book.cover_emoji}
//         </span>

//         <div className="absolute top-2 left-2 z-20">
//           <span className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-purple-700 shadow-sm">
//             {book.code}
//           </span>
//         </div>

//         <div className="absolute top-2 right-2 z-20">
//           {booked ? (
//             <span className="flex items-center gap-1 rounded-full bg-rose-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
//               <Lock className="h-2.5 w-2.5" /> ถูกจองแล้ว
//             </span>
//           ) : (
//             <span className="flex items-center gap-1 rounded-full bg-emerald-500/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
//               <CheckCircle2 className="h-2.5 w-2.5" /> ว่าง
//             </span>
//           )}
//         </div>
//       </div>
      
//       <div className="p-3">
//         <div className="text-[10px] text-muted-foreground font-medium">{book.category}</div>
//         <div className={cn("font-bold leading-tight line-clamp-2", compact ? "text-sm" : "text-sm md:text-base")}>
//           {book.title}
//         </div>
//         {!compact && <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">{book.author}</div>}
//       </div>
//     </button>
//   );
// }

import { useState, useEffect } from "react";
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
  const [imageUrl, setImageUrl] = useState<string | null>(book.imageUrl || null);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    // ถ้ามีรูปในฐานข้อมูลอยู่แล้ว ไม่ต้องไปยิง API ให้เสียเวลา
    if (book.imageUrl || imageUrl) return;

    const cacheKey = `anime-img-${book.title}`;
    const cachedImg = sessionStorage.getItem(cacheKey);
    
    if (cachedImg) {
      setImageUrl(cachedImg);
      return;
    }

    const fetchImage = async (retryCount = 0) => {
      try {
        // ใช้ชื่อหนังสือเป็นตัวค้นหา
        const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(book.title)}&limit=1`);
        
        if (res.status === 429 && retryCount < 2) {
          setTimeout(() => fetchImage(retryCount + 1), 3000);
          return;
        }

        const data = await res.json();
        const fetchedUrl = data?.data?.[0]?.images?.webp?.image_url;
        
        if (fetchedUrl) {
          setImageUrl(fetchedUrl);
          sessionStorage.setItem(cacheKey, fetchedUrl);
        } else {
          // ถ้าไม่เจอรูป ให้ใส่รูป placeholder หรือปล่อยไว้อย่างนั้น
          console.log("No image found for:", book.title);
        }
      } catch (err) {
        console.error("Failed to fetch image:", book.title);
      }
    };

    const timeout = setTimeout(() => fetchImage(0), Math.random() * 2000);
    return () => clearTimeout(timeout);
  }, [book.title, book.imageUrl, imageUrl]);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative text-left rounded-2xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-xl",
        "glass",
        booked && "opacity-70 grayscale-[30%]"
      )}
    >
      <div
        className={cn(
          "relative aspect-[3/4] w-full bg-gradient-to-br flex items-center justify-center text-6xl overflow-hidden",
          book.gradient
        )}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={book.title}
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
          />
        )}

        <span className={cn("drop-shadow-md z-10", imgLoaded && "hidden")}>
          {book.cover_emoji}
        </span>

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