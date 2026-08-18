import { createFileRoute } from "@tanstack/react-router";
import { FileDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { FileDrop, PageHeader } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";
import { downloadBlob, imagesToPdf } from "@/lib/pdf-tools";

export const Route = createFileRoute("/image-to-pdf")({
  head: () => ({
    meta: [
      { title: "تحويل الصور إلى PDF — SmartPDF Studio" },
      { name: "description", content: "حوّل صور JPG و PNG إلى ملف PDF واحد بسهولة داخل المتصفح." },
      { property: "og:title", content: "Image to PDF — SmartPDF Studio" },
      { property: "og:description", content: "Convert JPG and PNG images into a single PDF." },
    ],
  }),
  component: ImageToPdfPage,
});

function ImageToPdfPage() {
  const { t } = useI18n();
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      const bytes = await imagesToPdf(files);
      downloadBlob(bytes, "images.pdf");
      toast.success(t("done"));
    } catch {
      toast.error(t("invalid_pdf"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppLayout>
      <PageHeader title={t("nav_image")} description={t("card_image_desc")} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <FileDrop
            label={t("drop_images")}
            accept="image/png,image/jpeg"
            multiple
            onFiles={(f) => setFiles((p) => [...p, ...f.filter((x) => /image\/(png|jpeg)/.test(x.type))])}
          />
          {files.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {files.map((file, i) => (
                <div key={`${file.name}-${i}`} className="surface-card group relative overflow-hidden p-0">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="aspect-square w-full object-cover"
                  />
                  <button
                    onClick={() => setFiles((p) => p.filter((_, idx) => idx !== i))}
                    aria-label={t("remove")}
                    className="absolute end-2 top-2 rounded-lg bg-card/90 p-1.5 text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card flex h-fit flex-col gap-3 p-5">
          <h2 className="text-sm font-bold">
            {t("files_selected")} ({files.length})
          </h2>
          <button
            disabled={!files.length || busy}
            onClick={run}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            <FileDown className="size-4" />
            {busy ? t("processing") : t("image_action")}
          </button>
          {files.length > 0 && (
            <button
              onClick={() => setFiles([])}
              className="text-xs font-semibold text-destructive hover:underline"
            >
              {t("clear")}
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
