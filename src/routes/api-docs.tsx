import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Copy, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Route = createFileRoute("/api-docs")({
  head: () => ({
    meta: [
      { title: "API Docs — อ่านปะ" },
      { name: "description", content: "API สาธารณะของอ่านปะ — ดูหนังสือว่าง จองหนังสือ คืนหนังสือ" },
    ],
  }),
  component: ApiDocsPage,
});

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <pre className="rounded-xl bg-slate-900 text-slate-100 text-xs p-4 overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute top-2 right-2 rounded-lg bg-white/10 hover:bg-white/20 p-1.5 text-white"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function ApiDocsPage() {
  const [base, setBase] = useState("");
  useEffect(() => {
    setBase(window.location.origin);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <div className="animate-fade-up">
        <h1 className="text-3xl md:text-4xl font-extrabold">
          <span className="gradient-text">API สำหรับนักพัฒนา</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          REST API สาธารณะ พร้อม CORS เปิดให้ทุก origin เรียกใช้ได้เลย ไม่ต้องใช้ API key
        </p>
      </div>

      <div className="glass-strong rounded-2xl p-5">
        <div className="text-xs font-semibold text-muted-foreground">Base URL</div>
        <div className="mt-1 flex items-center gap-2">
          <code className="flex-1 rounded-lg bg-slate-900 text-emerald-300 px-3 py-2 text-sm font-mono break-all">
            {base || "..."}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(base);
              toast.success("คัดลอกแล้ว");
            }}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Endpoint
        index={1}
        method="GET"
        path="/api/public/books/available"
        title="ดูหนังสือที่ว่างอยู่"
        desc="คืนรายการหนังสือทั้งหมดที่ยังไม่ถูกจอง"
        base={base}
        curl={`curl -X GET '${base}/api/public/books/available'`}
        sampleBody={null}
        defaults={{}}
        fields={[]}
      />

      <Endpoint
        index={2}
        method="POST"
        path="/api/public/bookings"
        title="จองหนังสือ"
        desc="จองหนังสือเล่มที่ว่าง ถ้าโดนจองไปแล้วจะคืนค่า success:false"
        base={base}
        curl={`curl -X POST '${base}/api/public/bookings' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "borrower_name": "โกะโจ ซาโตรุ",
    "book_code": "JP-001",
    "borrow_date": "2026-06-04",
    "return_date": "2026-06-11"
  }'`}
        sampleBody={{
          borrower_name: "โกะโจ ซาโตรุ",
          book_code: "JP-001",
          borrow_date: "2026-06-04",
          return_date: "2026-06-11",
        }}
        defaults={{}}
        fields={[
          { name: "borrower_name", desc: "ชื่อคนจอง (เล่นหรือจริง)" },
          { name: "book_code", desc: "เลขหนังสือ เช่น JP-001" },
          { name: "borrow_date", desc: "วันที่จอง รูปแบบ YYYY-MM-DD" },
          { name: "return_date", desc: "วันที่คืน รูปแบบ YYYY-MM-DD" },
        ]}
      />

      <Endpoint
        index={3}
        method="POST"
        path="/api/public/returns"
        title="คืนหนังสือ"
        desc="คืน/ยกเลิกการจอง — ต้องใช้ชื่อผู้จองให้ตรงกับตอนจอง"
        base={base}
        curl={`curl -X POST '${base}/api/public/returns' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "borrower_name": "โกะโจ ซาโตรุ",
    "book_code": "JP-001",
    "return_date": "2026-06-04"
  }'`}
        sampleBody={{
          borrower_name: "โกะโจ ซาโตรุ",
          book_code: "JP-001",
          return_date: "2026-06-04",
        }}
        defaults={{}}
        fields={[
          { name: "borrower_name", desc: "ชื่อคนจอง (ต้องตรงกับตอนจอง)" },
          { name: "book_code", desc: "เลขหนังสือ" },
          { name: "return_date", desc: "วันที่คืน YYYY-MM-DD" },
        ]}
      />
    </div>
  );
}

function Endpoint({
  index,
  method,
  path,
  title,
  desc,
  curl,
  base,
  sampleBody,
  fields,
}: {
  index: number;
  method: "GET" | "POST";
  path: string;
  title: string;
  desc: string;
  curl: string;
  base: string;
  sampleBody: Record<string, string> | null;
  defaults: Record<string, string>;
  fields: { name: string; desc: string }[];
}) {
  const [body, setBody] = useState(sampleBody ? JSON.stringify(sampleBody, null, 2) : "");
  const [resp, setResp] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    setResp("");
    try {
      const init: RequestInit = {
        method,
        headers: method === "POST" ? { "Content-Type": "application/json" } : undefined,
        body: method === "POST" ? body : undefined,
      };
      const r = await fetch(path, init);
      const text = await r.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {/* keep */}
      setResp(`HTTP ${r.status}\n\n${pretty}`);
    } catch (e) {
      setResp(`Error: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="glass-strong rounded-2xl p-6 animate-fade-up">
      <div className="flex items-start gap-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-pink-300 to-purple-300 text-white text-sm font-bold">
          {index}
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-muted-foreground">{desc}</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className={`rounded-md px-2 py-0.5 font-bold text-white ${method === "GET" ? "bg-emerald-500" : "bg-blue-500"}`}>
              {method}
            </span>
            <code className="font-mono text-foreground/80 break-all">{base}{path}</code>
          </div>
        </div>
      </div>

      {fields.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-muted-foreground mb-1">Parameters (JSON body)</div>
          <ul className="text-sm space-y-0.5">
            {fields.map((f) => (
              <li key={f.name}>
                <code className="font-mono text-purple-700">{f.name}</code>
                <span className="text-muted-foreground"> — {f.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <div className="text-xs font-semibold text-muted-foreground mb-1">cURL</div>
        <CodeBlock code={curl} />
      </div>

      <div className="mt-4 rounded-xl border-2 border-dashed border-purple-200 p-4 bg-white/50">
        <div className="font-semibold text-sm mb-2 flex items-center gap-2">
          <Play className="h-4 w-4 text-purple-600" /> ทดสอบ API
        </div>
        {method === "POST" && (
          <div className="space-y-1.5 mb-3">
            <Label className="text-xs">Request body (JSON)</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="font-mono text-xs bg-white"
            />
          </div>
        )}
        <Button
          onClick={run}
          disabled={loading}
          className="bg-gradient-to-r from-pink-400 to-purple-400 text-white"
        >
          {loading ? "กำลังเรียก..." : "Send request"}
        </Button>
        {resp && (
          <div className="mt-3">
            <Label className="text-xs">Response</Label>
            <pre className="mt-1 rounded-xl bg-slate-900 text-slate-100 text-xs p-3 overflow-x-auto max-h-72">
              {resp}
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}
