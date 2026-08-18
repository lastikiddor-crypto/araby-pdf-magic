import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Download, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { FileDrop, PageHeader } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";
import { downloadBlob, mergePdfs } from "@/lib/pdf-tools";

export const Route = createFileRoute("/merge")({
  head: () => ({
    meta: [
      { title: "دمج ملفات PDF — SmartPDF Studio" },
      { name: "description", content: "ادمج عدة ملفات PDF في مستند واحد داخل المتصفح مجانًا." },
      { property: "og:title", content: "Merge PDFs — SmartPDF Studio" },
      { property: "og:description", content: "Combine multiple PDF files into one, locally." },
    ],
  }),
  component: MergePage,
});

function MergePage() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const move = (index: number, delta: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + delta;
      if (target < 0 || target >= next.length) return prev;
      const a = next[index]!;
      next[index] = next[target]!;
      next[target] = a;
      return next;
    });
  };

  const run = async () => {
    setBusy(true);
    try {
      const bytes = await mergePdfs(files);
      downloadBlob(bytes, "merged.pdf");
      toast.success(t("done"));
    } catch {
      toast.error(t("invalid_pdf"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title={t("nav_merge")} description={t("card_merge_desc")} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <FileDrop
          label={t("drop_pdfs")}
          accept="application/pdf"
          multiple
          onFiles={(f) => setFiles((prev) => [...prev, ...f.filter((x) => x.type === "application/pdf")])}
        />

        <div className="surface-card flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">
              {t("files_selected")} ({files.length})
            </h2>
            {files.length > 0 && (
              <button
                onClick={() => setFiles([])}
                className="text-xs font-semibold text-destructive hover:underline"
              >
                {t("clear")}
              </button>
            )}
          </div>

          {files.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("merge_hint")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {files.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate">{file.name}</span>
                  <button aria-label={t("move_up")} onClick={() => move(i, -1)} className="p-1 hover:text-primary">
                    <ArrowUp className="size-4" />
                  </button>
                  <button aria-label={t("move_down")} onClick={() => move(i, 1)} className="p-1 hover:text-primary">
                    <ArrowDown className="size-4" />
                  </button>
                  <button
                    aria-label={t("remove")}
                    onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                    className="p-1 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            disabled={files.length < 2 || busy}
            onClick={run}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-opacity disabled:opacity-40"
          >
            <Download className="size-4" />
            {busy ? t("processing") : t("merge_action")}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
