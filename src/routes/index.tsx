import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Files,
  Image as ImageIcon,
  Scissors,
  ShieldCheck,
  Signature,
} from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { useI18n, type TKey } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartPDF Studio — أدوات PDF في متصفحك" },
      {
        name: "description",
        content:
          "دمج وتقسيم وتوقيع وتحويل ملفات PDF مباشرة في المتصفح، بالعربية والإنجليزية، دون رفع أي ملف.",
      },
      { property: "og:title", content: "SmartPDF Studio — أدوات PDF في متصفحك" },
      {
        property: "og:description",
        content: "Merge, split, sign and convert PDFs locally. Arabic & English interface.",
      },
    ],
  }),
  component: Dashboard,
});

const tools: { to: string; key: TKey; desc: TKey; icon: typeof FileText }[] = [
  { to: "/viewer", key: "nav_viewer", desc: "card_viewer_desc", icon: FileText },
  { to: "/merge", key: "nav_merge", desc: "card_merge_desc", icon: Files },
  { to: "/split", key: "nav_split", desc: "card_split_desc", icon: Scissors },
  { to: "/image-to-pdf", key: "nav_image", desc: "card_image_desc", icon: ImageIcon },
  { to: "/pdf-to-text", key: "nav_text", desc: "card_text_desc", icon: FileText },
  { to: "/viewer", key: "sign_title", desc: "card_sign_desc", icon: Signature },
];

function Dashboard() {
  const { t, dir } = useI18n();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  return (
    <AppLayout>
      <section className="brand-gradient relative overflow-hidden rounded-3xl px-6 py-12 text-primary-foreground sm:px-10">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{t("brand")}</h1>
          <p className="mt-3 text-base opacity-90">{t("tagline")}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/viewer"
              className="inline-flex items-center gap-2 rounded-xl bg-card px-5 py-3 text-sm font-bold text-foreground transition-transform hover:-translate-y-0.5"
            >
              {t("hero_cta")}
              <Arrow className="size-4" />
            </Link>
            <Link
              to="/merge"
              className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/40 px-5 py-3 text-sm font-bold transition-colors hover:bg-primary-foreground/10"
            >
              {t("hero_secondary")}
            </Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -end-16 -top-16 size-72 rounded-full bg-primary-foreground/10" />
        <div className="pointer-events-none absolute -bottom-24 end-24 size-64 rounded-full bg-primary-foreground/10" />
      </section>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
        <ShieldCheck className="size-5 shrink-0 text-primary" />
        {t("privacy_note")}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map(({ to, key, desc, icon: Icon }) => (
          <Link
            key={key}
            to={to}
            className="surface-card group flex flex-col gap-3 p-6 transition-transform hover:-translate-y-1"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
              <Icon className="size-5" />
            </span>
            <h2 className="text-lg font-bold">{t(key)}</h2>
            <p className="text-sm text-muted-foreground">{t(desc)}</p>
            <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-semibold text-primary">
              {t("hero_cta")}
              <Arrow className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
