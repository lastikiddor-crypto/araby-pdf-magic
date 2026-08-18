import { createFileRoute } from "@tanstack/react-router";
import { Copy, Download, FileText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { FileDrop, PageHeader } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";
import { extractText } from "@/lib/pdfjs";
import { downloadBlob } from "@/lib/pdf-tools";

export const Route = createFileRoute("/pdf-to-text")({
  head: () => ({
    meta: [
      { title: "استخراج النص من PDF — SmartPDF Studio" },
      { name: "description", content: "استخرج النص من ملفات PDF وانسخه أو حمّله كملف نصي." },
      { property: "og:title", content: "PDF to Text — SmartPDF Studio" },
      { property: "og:description", content: "Extract text from a PDF, then copy or download it." },
    ],
  }),
  component: PdfToTextPage,
});

function PdfToTextPage() {
  const { t } = useI18n();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async (f: File) => {
    setFile(f);
    setBusy(true);
    setText("");
    try {
      const result = await extractText(f);
      setText(result || t("no_text"));
    } catch {
      toast.error(t("invalid_pdf"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title={t("nav_text")} description={t("card_text_desc")} />
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="flex flex-col gap-4">
          <FileDrop label={t("drop_pdf")} accept="application/pdf" onFiles={(f) => f[0] && run(f[0])} />
          {file && (
            <div className="surface-card flex items-center gap-2 p-4 text-sm">
              <FileText className="size-4 text-primary" />
              <span className="truncate">{file.name}</span>
            </div>
          )}
        </div>

        <div className="surface-card flex min-h-80 flex-col gap-3 p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold">{t("text_action")}</h2>
            <div className="ms-auto flex gap-2">
              <button
                disabled={!text}
                onClick={() => {
                  navigator.clipboard.writeText(text);
                  toast.success(t("copied"));
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
              >
                <Copy className="size-3.5" /> {t("copy")}
              </button>
              <button
                disabled={!text}
                onClick={() => downloadBlob(new Blob([text], { type: "text/plain" }), "extracted.txt")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
              >
                <Download className="size-3.5" /> {t("download")}
              </button>
            </div>
          </div>
          <textarea
            value={busy ? t("processing") : text}
            readOnly
            className="min-h-72 flex-1 resize-none rounded-xl bg-muted p-4 text-sm leading-relaxed outline-none"
          />
        </div>
      </div>
    </AppLayout>
  );
}
