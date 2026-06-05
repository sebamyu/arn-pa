import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const Schema = z.object({
  borrower_name: z.string().trim().min(1).max(80),
  book_code: z.string().trim().min(1).max(40),
  borrow_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const Route = createFileRoute("/api/public/bookings")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const json = (await request.json().catch(() => null)) as unknown;
        const parsed = Schema.safeParse(json);
        if (!parsed.success) {
          return jr({ success: false, message: "พารามิเตอร์ไม่ถูกต้อง", errors: parsed.error.flatten() }, 400);
        }
        const { borrower_name, book_code, borrow_date, return_date } = parsed.data;
        if (return_date < borrow_date) {
          return jr({ success: false, message: "วันที่คืนต้องไม่มาก่อนวันที่จอง" }, 400);
        }

        const { data: book, error: bookErr } = await supabaseAdmin
          .from("books")
          .select("id, code, title")
          .eq("code", book_code)
          .maybeSingle();
        if (bookErr) return jr({ success: false, message: bookErr.message }, 500);
        if (!book) return jr({ success: false, message: `ไม่พบหนังสือเลข ${book_code}` }, 404);

        const { data: active } = await supabaseAdmin
          .from("bookings")
          .select("id")
          .eq("book_id", book.id)
          .is("returned_at", null)
          .maybeSingle();
        if (active) {
          return jr({ success: false, message: "จองไม่ได้ — หนังสือถูกจองโดยคนอื่นไปแล้ว" }, 409);
        }

        const { data: inserted, error: insErr } = await supabaseAdmin
          .from("bookings")
          .insert({
            book_id: book.id,
            borrower_name,
            borrow_date,
            return_date,
          })
          .select("id, book_id, borrower_name, borrow_date, return_date")
          .single();
        if (insErr) {
          // Unique-index race
          if (insErr.code === "23505") {
            return jr({ success: false, message: "จองไม่ได้ — มีคนจองไปก่อนหน้านี้แล้ว" }, 409);
          }
          return jr({ success: false, message: insErr.message }, 500);
        }
        return jr({
          success: true,
          message: "จองสำเร็จ",
          booking: {
            id: inserted.id,
            borrower_name: inserted.borrower_name,
            book_code: book.code,
            book_title: book.title,
            borrow_date: inserted.borrow_date,
            return_date: inserted.return_date,
          },
        });
      },
    },
  },
});

function jr(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...CORS },
  });
}
