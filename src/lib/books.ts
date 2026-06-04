export type Book = {
  id: string;
  code: string;
  title: string;
  author: string;
  category: string;
  cover_emoji: string;
  gradient: string;
  description: string;
  is_trending: boolean;
};

export type Booking = {
  id: string;
  book_id: string;
  borrower_name: string;
  borrow_date: string;
  return_date: string;
  returned_at: string | null;
};

export type BookWithStatus = Book & {
  activeBooking: Booking | null;
};

export const CATEGORIES = [
  "ทั้งหมด",
  "มังงะญี่ปุ่น",
  "มันฮวาเกาหลี",
  "การ์ตูนจีน",
  "นิยายวาย",
  "นิยายยูริ",
] as const;
