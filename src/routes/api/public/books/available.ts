import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const Route = createFileRoute("/api/public/books/available")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: CORS }),
      GET: async () => {
        const { data: books, error } = await supabaseAdmin
          .from("books")
          .select("id, code, title, author, category, description, is_trending")
          .order("code", { ascending: true });
        if (error) {
          return new Response(JSON.stringify({ success: false, message: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...CORS },
          });
        }
        const { data: active } = await supabaseAdmin
          .from("bookings")
          .select("book_id")
          .is("returned_at", null);
        const busy = new Set((active ?? []).map((b: { book_id: string }) => b.book_id));
        const available = (books ?? []).filter((b) => !busy.has(b.id));
        return new Response(
          JSON.stringify({
            success: true,
            count: available.length,
            books: available,
          }),
          { headers: { "Content-Type": "application/json", ...CORS } },
        );
      },
    },
  },
});
