import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { Download, Minimize2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { FileDrop, PageHeader } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";
import { compressPdf, downloadBlob } from "@/lib/pdf-tools";

export const Route = createFileRoute("/compress")({
  head: () => ({
    meta: [
      { title: "ضغط ملف PDF — SmartPDF Studio" },
      {
        name: "description",
        content: "قلّل حجم ملفات PDF مع التحكم في مستوى الجودة قبل التحميل.",
      },
      { property: "og:title", content: "Compress PDF — SmartPDF Studio" },
      { property: "og:description", content: "Reduce PDF file size with adjustable quality." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <AppLayout>
      <ClientOnly>
        <CompressPage />
      </ClientOnly>
    </AppLayout>
  ),
});

const fmt = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

function CompressPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(60);
  const [result, setResult] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = await compressPdf(file, quality / 100, quality > 70 ? 1.6 : 1.2);
      setResult(bytes.byteLength);
      downloadBlob(bytes, `compressed-${file.name}`);
      toast.success(t("done"));
    } catch {
      toast.error(t("invalid_pdf"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title={t("nav_compress")} description={t("card_compress_desc")} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <FileDrop
          label={t("drop_pdf")}
          accept="application/pdf"
          onFiles={(f) => {
            if (f[0]) {
              setFile(f[0]);
              setResult(null);
            }
          }}
        />

        <div className="surface-card flex flex-col gap-4 p-5">
          <div>
            <p className="text-sm font-bold">{file ? file.name : t("choose_file")}</p>
            {file && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t("size_before")}: {fmt(file.size)}
              </p>
            )}
            {result !== null && (
              <p className="mt-1 text-xs font-semibold text-primary">
                {t("size_after")}: {fmt(result)}
              </p>
            )}
          </div>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            {t("compress_quality")}: {quality}%
            <input
              type="range"
              min={20}
              max={90}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="accent-primary"
            />
          </label>

          <p className="text-xs leading-relaxed text-muted-foreground">{t("compress_note")}</p>

          <button
            disabled={!file || busy}
            onClick={run}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            {busy ? <Download className="size-4" /> : <Minimize2 className="size-4" />}
            {busy ? t("processing") : t("compress_action")}
          </button>
        </div>
      </div>
    </>
  );
}
