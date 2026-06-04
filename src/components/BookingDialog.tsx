import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Lock, Send, Undo2 } from "lucide-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import type { BookWithStatus } from "@/lib/books";

function toISODate(d: Date) {
  // YYYY-MM-DD in local time
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function DatePick({
  value,
  onChange,
  placeholder,
  min,
}: {
  value?: Date;
  onChange: (d: Date | undefined) => void;
  placeholder: string;
  min?: Date;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value ? toISODate(value) : "");

  useEffect(() => {
    setText(value ? toISODate(value) : "");
  }, [value]);

  return (
    <div className="flex gap-2">
      <Input
        type="date"
        value={text}
        min={min ? toISODate(min) : undefined}
        onChange={(e) => {
          setText(e.target.value);
          const v = e.target.value;
          if (v) {
            const [y, m, d] = v.split("-").map(Number);
            onChange(new Date(y, m - 1, d));
          } else {
            onChange(undefined);
          }
        }}
        placeholder={placeholder}
        className="bg-white"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" type="button" className="shrink-0 bg-white">
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto" align="end">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
            disabled={min ? { before: min } : undefined}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function BookingDialog({
  book,
  onClose,
  onChanged,
}: {
  book: BookWithStatus | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [name, setName] = useState("");
  const [borrow, setBorrow] = useState<Date | undefined>(new Date());
  const [ret, setRet] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d;
  });
  const [submitting, setSubmitting] = useState(false);
  const [cancelName, setCancelName] = useState("");

  useEffect(() => {
    if (book) {
      setName("");
      setCancelName("");
      setBorrow(new Date());
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setRet(d);
    }
  }, [book?.id]);

  if (!book) return null;
  const booked = !!book.activeBooking;

  async function submitBook() {
    if (!book) return;
    if (!name.trim()) return toast.error("กรุณากรอกชื่อผู้จอง");
    if (!borrow || !ret) return toast.error("กรุณาเลือกวันที่ให้ครบ");
    if (ret < borrow) return toast.error("วันที่คืนต้องมาหลังวันที่จอง");
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          borrower_name: name.trim(),
          book_code: book.code,
          borrow_date: toISODate(borrow),
          return_date: toISODate(ret),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "จองไม่สำเร็จ");
      } else {
        toast.success("จองสำเร็จ! 🎉");
        onChanged();
        onClose();
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReturn() {
    if (!book?.activeBooking) return;
    if (!cancelName.trim()) return toast.error("กรุณากรอกชื่อผู้จองเพื่อยืนยัน");
    setSubmitting(true);
    try {
      const res = await fetch("/api/public/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          borrower_name: cancelName.trim(),
          book_code: book.code,
          return_date: toISODate(new Date()),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast.error(data.message || "ยกเลิก/คืนไม่สำเร็จ");
      } else {
        toast.success("คืนหนังสือสำเร็จ ✨");
        onChanged();
        onClose();
      }
    } catch {
      toast.error("เกิดข้อผิดพลาด ลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={!!book} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{book.cover_emoji}</span>
            {book.title}
          </DialogTitle>
          <DialogDescription>
            {book.author} · {book.category} · เลขเล่ม{" "}
            <span className="font-mono font-bold text-foreground">{book.code}</span>
          </DialogDescription>
        </DialogHeader>

        {booked ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-rose-50 border border-rose-200 p-4">
              <div className="flex items-center gap-2 font-semibold text-rose-700">
                <Lock className="h-4 w-4" /> ไม่ว่าง — ถูกจองแล้ว
              </div>
              <div className="mt-2 text-sm text-rose-900/80">
                ผู้จอง: <b>{book.activeBooking!.borrower_name}</b><br />
                จอง: {book.activeBooking!.borrow_date} → คืน: {book.activeBooking!.return_date}
              </div>
            </div>

            <div className="rounded-2xl border border-purple-200 bg-purple-50/60 p-4 space-y-3">
              <div className="text-sm font-semibold">คืน / ยกเลิกการจอง</div>
              <p className="text-xs text-muted-foreground">
                เฉพาะคนที่จองเท่านั้นที่จะคืนได้ — กรอกชื่อให้ตรงกับชื่อผู้จองด้านบน
              </p>
              <Input
                value={cancelName}
                onChange={(e) => setCancelName(e.target.value)}
                placeholder="ชื่อผู้จอง"
                className="bg-white"
              />
              <Button
                onClick={submitReturn}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-rose-400 to-pink-400 hover:opacity-90"
              >
                <Undo2 className="h-4 w-4 mr-1" /> คืน / ยกเลิกการจอง
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-sm font-semibold text-emerald-700 text-center">
              ✅ ว่าง สามารถจองได้
            </div>

            <div className="space-y-1.5">
              <Label>ชื่อผู้จอง</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น โกะโจ ซาโตรุ"
                className="bg-white"
                maxLength={80}
              />
            </div>

            <div className="space-y-1.5">
              <Label>เลขหนังสือ</Label>
              <Input value={book.code} disabled className="bg-muted font-mono" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>วันที่จอง</Label>
                <DatePick value={borrow} onChange={setBorrow} placeholder="วันจอง" />
              </div>
              <div className="space-y-1.5">
                <Label>วันที่คืน</Label>
                <DatePick value={ret} onChange={setRet} placeholder="วันคืน" min={borrow} />
              </div>
            </div>

            <Button
              onClick={submitBook}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:opacity-90 text-white"
            >
              <Send className="h-4 w-4 mr-1" /> ยืนยันการจอง
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
