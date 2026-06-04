import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const Schema = z.object({
  borrower_name: z.string().trim().min(1).max(80),
  book_code: z.string().trim().min(1).max(40),
  return_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const Route = createFileRoute("/api/public/returns")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      POST: async ({ request }) => {
        const json = (await request.json().catch(() => null)) as unknown;
        const parsed = Schema.safeParse(json);
        if (!parsed.success) {
          return jr({ success: false, message: "พารามิเตอร์ไม่ถูกต้อง", errors: parsed.error.flatten() }, 400);
        }
        const { borrower_name, book_code, return_date } = parsed.data;

        const { data: book } = await supabaseAdmin
          .from("books")
          .select("id, code, title")
          .eq("code", book_code)
          .maybeSingle();
        if (!book) return jr({ success: false, message: `ไม่พบหนังสือเลข ${book_code}` }, 404);

        const { data: active } = await supabaseAdmin
          .from("bookings")
          .select("id, borrower_name")
          .eq("book_id", book.id)
          .is("returned_at", null)
          .maybeSingle();
        if (!active) {
          return jr({ success: false, message: "หนังสือเล่มนี้ไม่มีการจองค้างอยู่" }, 404);
        }

        // Case-insensitive trimmed name compare
        const norm = (s: string) => s.trim().toLowerCase();
        if (norm(active.borrower_name) !== norm(borrower_name)) {
          return jr({ success: false, message: "ชื่อผู้จองไม่ตรง — คืนไม่ได้" }, 403);
        }

        const { error: upErr } = await supabaseAdmin
          .from("bookings")
          .update({
            returned_at: new Date().toISOString(),
            return_date,
          })
          .eq("id", active.id);
        if (upErr) return jr({ success: false, message: upErr.message }, 500);

        return jr({
          success: true,
          message: "คืนหนังสือสำเร็จ",
          book_code: book.code,
          book_title: book.title,
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
