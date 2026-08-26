import { createFileRoute } from "@tanstack/react-router";
import { Download, Scissors } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { FileDrop, PageHeader } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";
import { countPages, downloadBlob, splitPdf } from "@/lib/pdf-tools";

export const Route = createFileRoute("/split")({
  head: () => ({
    meta: [
      { title: "تقسيم ملف PDF — SmartPDF Studio" },
      { name: "description", content: "استخرج صفحات محددة من ملف PDF إلى مستند جديد بسهولة." },
      { property: "og:title", content: "Split PDF — SmartPDF Studio" },
      { property: "og:description", content: "Extract specific pages from a PDF into a new file." },
    ],
  }),
  component: SplitPage,
});

function SplitPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [range, setRange] = useState("");
  const [busy, setBusy] = useState(false);

  const pick = async (f: File) => {
    try {
      const count = await countPages(f);
      setFile(f);
      setPages(count);
      setRange(`1-${count}`);
    } catch {
      toast.error(t("invalid_pdf"));
    }
  };

  const run = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const bytes = await splitPdf(file, range);
      if (!bytes) {
        toast.error(t("split_placeholder"));
        return;
      }
      downloadBlob(bytes, `split-${file.name}`);
      toast.success(t("done"));
    } catch {
      toast.error(t("invalid_pdf"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title={t("nav_split")} description={t("card_split_desc")} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <FileDrop label={t("drop_pdf")} accept="application/pdf" onFiles={(f) => f[0] && pick(f[0])} />

        <div className="surface-card flex flex-col gap-4 p-5">
          <div>
            <p className="text-sm font-bold">{file ? file.name : t("choose_file")}</p>
            {file && (
              <p className="mt-1 text-xs text-muted-foreground">
                {t("pages_count")}: {pages}
              </p>
            )}
          </div>

          <label className="flex flex-col gap-2 text-sm font-semibold">
            {t("split_range")}
            <input
              value={range}
              onChange={(e) => setRange(e.target.value)}
              placeholder={t("split_placeholder")}
              dir="ltr"
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>

          <button
            disabled={!file || busy || !range.trim()}
            onClick={run}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            {busy ? <Download className="size-4" /> : <Scissors className="size-4" />}
            {busy ? t("processing") : t("split_action")}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
