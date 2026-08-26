import { createFileRoute } from "@tanstack/react-router";
import { Download, RotateCcw, RotateCw, Save, Trash2, Undo2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { FileDrop, PageHeader } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";
import { countPages, downloadBlob, organizePdf } from "@/lib/pdf-tools";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/organize")({
  head: () => ({
    meta: [
      { title: "تنظيم صفحات PDF — SmartPDF Studio" },
      {
        name: "description",
        content: "دوّر أو احذف صفحات محددة من ملف PDF ثم احفظ نسخة جديدة منظّمة.",
      },
      { property: "og:title", content: "Organize PDF Pages — SmartPDF Studio" },
      { property: "og:description", content: "Rotate or delete specific PDF pages and save a new copy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrganizePage,
});

function OrganizePage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [deleted, setDeleted] = useState<number[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);

  const pick = async (f: File) => {
    try {
      setPages(await countPages(f));
      setFile(f);
      setDeleted([]);
      setRotations({});
    } catch {
      toast.error(t("invalid_pdf"));
    }
  };

  const rotate = (n: number, delta: number) =>
    setRotations((r) => ({ ...r, [n]: (((r[n] ?? 0) + delta) % 360 + 360) % 360 }));

  const toggleDelete = (n: number) =>
    setDeleted((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n]));

  const run = async () => {
    if (!file) return;
    const keep = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => !deleted.includes(n));
    if (!keep.length) {
      toast.error(t("no_pages_left"));
      return;
    }
    setBusy(true);
    try {
      const bytes = await organizePdf(file, keep, rotations);
      if (bytes) downloadBlob(bytes, `organized-${file.name}`);
      toast.success(t("done"));
    } catch {
      toast.error(t("invalid_pdf"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title={t("nav_organize")} description={t("card_organize_desc")} />
      {!file ? (
        <div className="mx-auto max-w-2xl">
          <FileDrop label={t("drop_pdf")} accept="application/pdf" onFiles={(f) => f[0] && pick(f[0])} />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="surface-card flex flex-wrap items-center gap-3 p-4">
            <p className="text-sm font-bold">{file.name}</p>
            <span className="text-xs text-muted-foreground">
              {t("pages_count")}: {pages}
            </span>
            <span className="text-xs text-muted-foreground">{t("organize_hint")}</span>
            <div className="ms-auto flex gap-2">
              <button
                onClick={() => {
                  setFile(null);
                  setDeleted([]);
                  setRotations({});
                }}
                className="rounded-xl border border-border px-3 py-2.5 text-xs font-bold hover:bg-muted"
              >
                {t("clear")}
              </button>
              <button
                onClick={run}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground disabled:opacity-40"
              >
                {busy ? <Download className="size-4" /> : <Save className="size-4" />}
                {busy ? t("processing") : t("organize_action")}
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => {
              const isDeleted = deleted.includes(n);
              return (
                <div
                  key={n}
                  className={cn(
                    "surface-card flex flex-col items-center gap-3 p-4 transition-opacity",
                    isDeleted && "opacity-40",
                  )}
                >
                  <div
                    className="flex h-28 w-20 items-center justify-center rounded-lg border border-border bg-muted text-lg font-bold transition-transform"
                    style={{ transform: `rotate(${rotations[n] ?? 0}deg)` }}
                  >
                    {n}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => rotate(n, -90)}
                      aria-label={t("rotate_left")}
                      className="rounded-lg border border-border p-2 hover:bg-muted"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                    <button
                      onClick={() => rotate(n, 90)}
                      aria-label={t("rotate_right")}
                      className="rounded-lg border border-border p-2 hover:bg-muted"
                    >
                      <RotateCw className="size-3.5" />
                    </button>
                    <button
                      onClick={() => toggleDelete(n)}
                      aria-label={isDeleted ? t("restore_page") : t("delete_page")}
                      className={cn(
                        "rounded-lg border border-border p-2 hover:bg-muted",
                        !isDeleted && "text-destructive",
                      )}
                    >
                      {isDeleted ? <Undo2 className="size-3.5" /> : <Trash2 className="size-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
