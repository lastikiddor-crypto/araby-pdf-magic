import { createFileRoute } from "@tanstack/react-router";
import { Download, Droplets } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { FileDrop, PageHeader } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";
import { downloadBlob, watermarkPdf } from "@/lib/pdf-tools";

export const Route = createFileRoute("/watermark")({
  head: () => ({
    meta: [
      { title: "إضافة علامة مائية إلى PDF — SmartPDF Studio" },
      {
        name: "description",
        content: "أضف نص علامة مائية شفاف بأي لغة على كل صفحات ملف PDF مع تحكم في الشفافية والزاوية.",
      },
      { property: "og:title", content: "Add a PDF Watermark — SmartPDF Studio" },
      { property: "og:description", content: "Stamp a translucent text watermark on every PDF page." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: WatermarkPage,
});

function WatermarkPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [opacity, setOpacity] = useState(20);
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState("#ef4444");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!file || !text.trim()) return;
    setBusy(true);
    try {
      const bytes = await watermarkPdf(file, text.trim(), {
        opacity: opacity / 100,
        rotation,
        color,
      });
      downloadBlob(bytes, `watermark-${file.name}`);
      toast.success(t("done"));
    } catch {
      toast.error(t("invalid_pdf"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title={t("nav_watermark")} description={t("card_watermark_desc")} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <FileDrop label={t("drop_pdf")} accept="application/pdf" onFiles={(f) => f[0] && setFile(f[0])} />

        <div className="surface-card flex flex-col gap-4 p-5">
          <p className="text-sm font-bold">{file ? file.name : t("choose_file")}</p>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            {t("watermark_text")}
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("watermark_placeholder")}
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            {t("watermark_opacity")}: {opacity}%
            <input
              type="range"
              min={5}
              max={80}
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="accent-primary"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            {t("watermark_rotation")}: {rotation}°
            <input
              type="range"
              min={0}
              max={90}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="accent-primary"
            />
          </label>

          <label className="flex items-center justify-between gap-2 text-sm font-semibold">
            {t("watermark_color")}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-16 cursor-pointer rounded-lg border border-input bg-background"
            />
          </label>

          <button
            disabled={!file || busy || !text.trim()}
            onClick={run}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            {busy ? <Download className="size-4" /> : <Droplets className="size-4" />}
            {busy ? t("processing") : t("watermark_action")}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
