
CREATE TABLE public.books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  title text NOT NULL,
  author text NOT NULL DEFAULT '',
  category text NOT NULL,
  cover_emoji text NOT NULL DEFAULT '📚',
  gradient text NOT NULL DEFAULT 'from-pink-200 to-purple-200',
  description text NOT NULL DEFAULT '',
  is_trending boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.books TO anon, authenticated;
GRANT ALL ON public.books TO service_role;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "books_public_read" ON public.books FOR SELECT USING (true);

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  borrower_name text NOT NULL,
  borrow_date date NOT NULL,
  return_date date NOT NULL,
  returned_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Only ONE active (not returned) booking per book at a time
CREATE UNIQUE INDEX bookings_one_active_per_book
  ON public.bookings (book_id) WHERE returned_at IS NULL;

CREATE INDEX bookings_book_id_idx ON public.bookings (book_id);

GRANT SELECT ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_public_read" ON public.bookings FOR SELECT USING (true);
-- Writes go through server-side API only (uses service_role)

ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.books;
ALTER TABLE public.bookings REPLICA IDENTITY FULL;
ALTER TABLE public.books REPLICA IDENTITY FULL;
