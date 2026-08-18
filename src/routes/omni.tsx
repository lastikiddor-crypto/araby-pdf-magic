import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  Droplets,
  FileText,
  Files,
  Image as ImageIcon,
  Lock,
  MoreVertical,
  Scissors,
  Search,
  Signature,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/omni")({
  head: () => ({
    meta: [
      { title: "أومني بي دي إف - الأدوات الاحترافية" },
      {
        name: "description",
        content:
          "أومني بي دي إف: تطبيق احترافي لإدارة ملفات PDF بسهولة على الهاتف. دمج، تقسيم، توقيع، وحماية ملفاتك.",
      },
      { name: "theme-color", content: "#0a0a0a" },
      { property: "og:title", content: "أومني بي دي إف - الأدوات الاحترافية" },
      {
        property: "og:description",
        content: "تطبيق احترافي لإدارة ملفات PDF على الهاتف المحمول.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OmniScreen,
});

const tools = [
  { id: "merge", icon: Files, label: "دمج ملفات PDF" },
  { id: "split", icon: Scissors, label: "تقسيم الصفحات" },
  { id: "image", icon: ImageIcon, label: "تحويل الصور إلى PDF" },
  { id: "sign", icon: Signature, label: "توقيع إلكتروني حاص" },
  { id: "protect", icon: Lock, label: "حماية الملف بكلمة مرور" },
  { id: "watermark", icon: Droplets, label: "إضافة علامة مائية" },
];

const recentFiles = [
  {
    id: 1,
    name: "تقرير_العمل.pdf",
    date: "٢٠٢٦/٠٨/١٨",
    size: "2.4 ميجابايت",
    color: "bg-omni-accent",
  },
  {
    id: 2,
    name: "فاتورة_الكهرباء.pdf",
    date: "٢٠٢٦/٠٨/١٧",
    size: "1.1 ميجابايت",
    color: "bg-blue-600",
  },
  {
    id: 3,
    name: "عقد_الإيجار.pdf",
    date: "٢٠٢٦/٠٨/١٥",
    size: "3.7 ميجابايت",
    color: "bg-green-600",
  },
  {
    id: 4,
    name: "عرض_سعر_2026.pdf",
    date: "٢٠٢٦/٠٨/١٢",
    size: "0.9 ميجابايت",
    color: "bg-amber-500",
  },
];

function OmniScreen() {
  const [notificationCount] = useState(3);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-omni-bg text-omni-text font-sans">
      {/* Premium header */}
      <header className="sticky top-0 z-50 border-b border-omni-border bg-omni-bg/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-md items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-omni-accent shadow-lg shadow-omni-accent/25">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold leading-tight">أومني بي دي إف</span>
              <span className="text-[10px] font-medium text-omni-text-muted">الأدوات الاحترافية</span>
            </div>
          </div>

          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-omni-surface transition-colors hover:bg-omni-elevated active:scale-95"
            aria-label="الإشعارات"
          >
            <Bell className="h-5 w-5 text-omni-text" />
            {notificationCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-omni-accent text-[10px] font-bold text-white shadow-md shadow-omni-accent/30">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-md px-5 pb-8 pt-6">
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 right-4 flex items-center">
            <Search className="h-4 w-4 text-omni-text-muted" />
          </div>
          <input
            type="text"
            placeholder="ابحث في ملفاتك وأدواتك..."
            className="h-11 w-full rounded-2xl border border-omni-border bg-omni-surface pr-10 pl-4 text-sm text-omni-text placeholder:text-omni-text-muted/70 focus:border-omni-accent focus:outline-none focus:ring-2 focus:ring-omni-accent/20"
          />
        </div>

        {/* Quick stats / welcome card */}
        <section className="mb-6 rounded-3xl bg-gradient-to-br from-omni-surface to-omni-elevated border border-omni-border p-5">
          <p className="text-xs font-medium text-omni-text-muted">مرحباً بك مجدداً</p>
          <h2 className="mt-1 text-xl font-bold">ابدأ العمل على ملفات PDF</h2>
          <p className="mt-2 text-xs leading-relaxed text-omni-text-muted">
            أدوات احترافية سريعة لدمج وتقسيم وتوقيع وحماية ملفاتك مباشرة من الهاتف.
          </p>
        </section>

        {/* Tools hub */}
        <section className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold">أدوات سريعة</h3>
            <span className="rounded-full bg-omni-surface px-2.5 py-1 text-[10px] font-semibold text-omni-text-muted">
              {tools.length} أدوات
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;

              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`group relative flex flex-col items-start gap-3 overflow-hidden rounded-3xl border p-4 text-right transition-all active:scale-95 ${
                    isActive
                      ? "border-omni-accent bg-omni-surface shadow-lg shadow-omni-accent/15"
                      : "border-omni-border bg-omni-surface hover:border-omni-accent/40 hover:shadow-lg hover:shadow-omni-accent/10"
                  }`}
                  aria-label={tool.label}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-omni-accent text-white shadow-lg shadow-omni-accent/25 transition-transform group-hover:scale-105">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold leading-snug">{tool.label}</span>
                  {isActive && (
                    <span className="absolute left-3 top-3 h-2 w-2 rounded-full bg-omni-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Recent files */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold">ملفاتي الأخيرة</h3>
            <button className="text-xs font-bold text-omni-accent transition-colors hover:text-omni-accent-hover">
              عرض الكل
            </button>
          </div>

          <div className="space-y-3">
            {recentFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 rounded-2xl border border-omni-border bg-omni-surface p-3.5 transition-colors hover:border-omni-accent/30"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${file.color} text-white shadow-md`}
                >
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-omni-text">{file.name}</p>
                  <p className="mt-0.5 text-[11px] text-omni-text-muted">
                    {file.date} · {file.size}
                  </p>
                </div>
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full text-omni-text-muted transition-colors hover:bg-omni-elevated hover:text-omni-text"
                  aria-label="المزيد"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-omni-border bg-omni-surface text-sm font-semibold text-omni-text transition-colors hover:border-omni-accent/40 hover:bg-omni-elevated">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-omni-accent text-[10px] font-bold text-white">
              +
            </span>
            فتح ملف PDF جديد
          </button>
        </section>
      </main>

      {/* Mobile bottom bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-omni-border bg-omni-bg/95 backdrop-blur-xl pb-safe">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
          <NavButton icon={Files} label="الملفات" active />
          <NavButton icon={Search} label="بحث" />
          <div className="relative -top-5">
            <button className="flex h-14 w-14 items-center justify-center rounded-full bg-omni-accent text-white shadow-lg shadow-omni-accent/30 transition-transform active:scale-95">
              <span className="text-2xl font-bold leading-none">+</span>
            </button>
          </div>
          <NavButton icon={Bell} label="الإشعارات" />
          <NavButton icon={Lock} label="الحماية" />
        </div>
      </nav>

      {/* Spacer for fixed bottom bar */}
      <div className="h-20" />
    </div>
  );
}

function NavButton({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Files;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex flex-col items-center justify-center gap-1 px-3 py-1 transition-colors ${
        active ? "text-omni-accent" : "text-omni-text-muted hover:text-omni-text"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-semibold">{label}</span>
    </button>
  );
}
