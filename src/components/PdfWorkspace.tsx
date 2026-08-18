import { PDFDocument, rgb } from "pdf-lib";
import {
  Download,
  Highlighter,
  MousePointer2,
  Pen,
  Signature as SignatureIcon,
  Trash2,
  Type as TypeIcon,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { FileDrop } from "@/components/FileDrop";
import { useI18n } from "@/lib/i18n";
import { downloadBlob } from "@/lib/pdf-tools";
import { loadPdfjs, textToImage } from "@/lib/pdfjs";
import { cn } from "@/lib/utils";

type Tool = "select" | "sign" | "note" | "highlight";

type Annotation = {
  id: string;
  page: number;
  kind: "image" | "highlight";
  x: number;
  y: number;
  w: number;
  h: number;
  dataUrl?: string;
  label: string;
};

export default function PdfWorkspace() {
  const { t, dir } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const docRef = useRef<{ getPage: (n: number) => Promise<unknown>; numPages: number } | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1.1);
  const [loading, setLoading] = useState(false);
  const [tool, setTool] = useState<Tool>("select");
  const [signature, setSignature] = useState<string | null>(null);
  const [signMode, setSignMode] = useState<"draw" | "type">("draw");
  const [typedName, setTypedName] = useState("");
  const [noteText, setNoteText] = useState("");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const openFile = useCallback(
    async (f: File) => {
      setLoading(true);
      try {
        const pdfjs = await loadPdfjs();
        const doc = await pdfjs.getDocument({ data: new Uint8Array(await f.arrayBuffer()) }).promise;
        docRef.current = doc as never;
        setFile(f);
        setNumPages(doc.numPages);
        setPage(1);
        setAnnotations([]);
      } catch {
        toast.error(t("invalid_pdf"));
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const doc = docRef.current;
      const canvas = canvasRef.current;
      if (!doc || !canvas) return;
      const pdfPage = (await doc.getPage(page)) as {
        getViewport: (o: { scale: number }) => { width: number; height: number };
        render: (o: unknown) => { promise: Promise<void> };
      };
      if (cancelled) return;
      const viewport = pdfPage.getViewport({ scale: scale * (window.devicePixelRatio || 1) });
      const cssViewport = pdfPage.getViewport({ scale });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${cssViewport.width}px`;
      canvas.style.height = `${cssViewport.height}px`;
      const ctx = canvas.getContext("2d")!;
      await pdfPage.render({ canvasContext: ctx, viewport, canvas }).promise;
    };
    void render();
    return () => {
      cancelled = true;
    };
  }, [page, scale, file]);

  // --- signature pad ---
  const padPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = padRef.current!;
    const ctx = canvas.getContext("2d")!;
    drawing.current = true;
    const { x, y } = padPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const moveDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = padRef.current!.getContext("2d")!;
    const { x, y } = padPos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#0f766e";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const clearPad = () => {
    const canvas = padRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    if (signMode === "type") {
      if (!typedName.trim()) return;
      const img = textToImage(typedName.trim(), 48, "#0f766e");
      setSignature(img.dataUrl);
    } else {
      const canvas = padRef.current;
      if (!canvas) return;
      setSignature(canvas.toDataURL("image/png"));
    }
    setTool("sign");
    toast.success(t("place_hint"));
  };

  // --- placing annotations ---
  const placeAt = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool === "select") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    if (tool === "sign") {
      if (!signature) {
        toast.error(t("signature_needed"));
        return;
      }
      const img = new Image();
      img.onload = () => {
        const w = 0.28;
        const h = (img.height / img.width) * w * (rect.width / rect.height);
        setAnnotations((p) => [
          ...p,
          { id, page, kind: "image", x, y, w, h, dataUrl: signature, label: t("tool_sign") },
        ]);
      };
      img.src = signature;
      return;
    }

    if (tool === "note") {
      if (!noteText.trim()) return;
      const img = textToImage(noteText.trim(), 32, "#111827");
      const w = Math.min(0.5, (img.width / 900) * 1.2);
      const h = (img.height / img.width) * w * (rect.width / rect.height);
      setAnnotations((p) => [
        ...p,
        { id, page, kind: "image", x, y, w, h, dataUrl: img.dataUrl, label: noteText.trim() },
      ]);
      return;
    }

    setAnnotations((p) => [
      ...p,
      { id, page, kind: "highlight", x, y, w: 0.25, h: 0.03, label: t("tool_highlight") },
    ]);
  };

  const exportPdf = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      for (const a of annotations) {
        const target = pdf.getPage(a.page - 1);
        const { width, height } = target.getSize();
        const w = a.w * width;
        const h = a.h * height;
        const x = a.x * width;
        const y = height - a.y * height - h;
        if (a.kind === "highlight") {
          target.drawRectangle({ x, y, width: w, height: h, color: rgb(1, 0.92, 0.23), opacity: 0.4 });
        } else if (a.dataUrl) {
          const bytes = Uint8Array.from(atob(a.dataUrl.split(",")[1]!), (c) => c.charCodeAt(0));
          const png = await pdf.embedPng(bytes);
          target.drawImage(png, { x, y, width: w, height: h });
        }
      }
      downloadBlob(await pdf.save(), `signed-${file.name}`);
      toast.success(t("done"));
    } catch {
      toast.error(t("invalid_pdf"));
    } finally {
      setLoading(false);
    }
  };

  const Prev = dir === "rtl" ? ChevronRight : ChevronLeft;
  const Next = dir === "rtl" ? ChevronLeft : ChevronRight;

  if (!file) {
    return (
      <div className="mx-auto max-w-2xl">
        <FileDrop label={t("drop_pdf")} accept="application/pdf" onFiles={(f) => f[0] && openFile(f[0])} />
      </div>
    );
  }

  const tools: { id: Tool; label: string; icon: typeof Pen }[] = [
    { id: "select", label: t("tool_select"), icon: MousePointer2 },
    { id: "sign", label: t("tool_sign"), icon: SignatureIcon },
    { id: "note", label: t("tool_note"), icon: TypeIcon },
    { id: "highlight", label: t("tool_highlight"), icon: Highlighter },
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="flex min-w-0 flex-col gap-4">
        <div className="surface-card flex flex-wrap items-center gap-2 p-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            aria-label={t("prev_page")}
            className="rounded-lg border border-border p-2 hover:bg-muted"
          >
            <Prev className="size-4" />
          </button>
          <span className="text-sm font-semibold">
            {t("page")} {page} {t("of")} {numPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
            aria-label={t("next_page")}
            className="rounded-lg border border-border p-2 hover:bg-muted"
          >
            <Next className="size-4" />
          </button>

          <div className="ms-auto flex items-center gap-2">
            <button
              onClick={() => setScale((s) => Math.max(0.4, +(s - 0.2).toFixed(2)))}
              aria-label={t("zoom_out")}
              className="rounded-lg border border-border p-2 hover:bg-muted"
            >
              <ZoomOut className="size-4" />
            </button>
            <span className="w-12 text-center text-xs font-semibold">{Math.round(scale * 100)}%</span>
            <button
              onClick={() => setScale((s) => Math.min(3, +(s + 0.2).toFixed(2)))}
              aria-label={t("zoom_in")}
              className="rounded-lg border border-border p-2 hover:bg-muted"
            >
              <ZoomIn className="size-4" />
            </button>
            <button
              onClick={exportPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground"
            >
              <Download className="size-4" />
              {loading ? t("processing") : t("export_pdf")}
            </button>
          </div>
        </div>

        <div className="surface-card flex flex-wrap gap-2 p-3">
          {tools.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-colors",
                tool === id ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-secondary",
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          ))}
          {tool !== "select" && (
            <span className="ms-auto self-center text-xs text-muted-foreground">{t("place_hint")}</span>
          )}
        </div>

        <div className="overflow-auto rounded-2xl bg-surface p-4">
          <div
            className="relative mx-auto w-fit shadow-lg"
            onClick={placeAt}
            style={{ cursor: tool === "select" ? "default" : "crosshair" }}
          >
            <canvas ref={canvasRef} className="block rounded-sm bg-white" />
            {annotations
              .filter((a) => a.page === page)
              .map((a) => (
                <div
                  key={a.id}
                  className="pointer-events-none absolute"
                  style={{
                    left: `${a.x * 100}%`,
                    top: `${a.y * 100}%`,
                    width: `${a.w * 100}%`,
                    height: `${a.h * 100}%`,
                  }}
                >
                  {a.kind === "highlight" ? (
                    <span className="block size-full rounded-sm bg-highlight" />
                  ) : (
                    <img src={a.dataUrl} alt={a.label} className="size-full object-contain" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <aside className="flex flex-col gap-4">
        <div className="surface-card flex flex-col gap-3 p-5">
          <h2 className="text-sm font-bold">{t("sign_title")}</h2>
          <div className="flex gap-2">
            {(["draw", "type"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSignMode(mode)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-xs font-bold",
                  signMode === mode ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                {mode === "draw" ? t("draw") : t("type")}
              </button>
            ))}
          </div>

          {signMode === "draw" ? (
            <canvas
              ref={padRef}
              width={520}
              height={180}
              onPointerDown={startDraw}
              onPointerMove={moveDraw}
              onPointerUp={() => (drawing.current = false)}
              className="h-36 w-full touch-none rounded-xl border border-dashed border-border bg-white"
            />
          ) : (
            <input
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder={t("your_name")}
              className="rounded-xl border border-input bg-background px-3 py-2.5 text-lg outline-none focus:border-primary"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={saveSignature}
              className="flex-1 rounded-xl bg-primary px-3 py-2.5 text-xs font-bold text-primary-foreground"
            >
              {t("save_signature")}
            </button>
            {signMode === "draw" && (
              <button onClick={clearPad} className="rounded-xl border border-border px-3 py-2.5 text-xs font-bold">
                {t("clear_canvas")}
              </button>
            )}
          </div>

          {signature && (
            <img src={signature} alt={t("tool_sign")} className="h-16 w-full rounded-lg bg-white object-contain" />
          )}
        </div>

        <div className="surface-card flex flex-col gap-3 p-5">
          <h2 className="text-sm font-bold">{t("tool_note")}</h2>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t("note_text")}
            className="min-h-20 resize-none rounded-xl border border-input bg-background p-3 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={() => setTool("note")}
            disabled={!noteText.trim()}
            className="rounded-xl bg-secondary px-3 py-2.5 text-xs font-bold text-secondary-foreground disabled:opacity-40"
          >
            {t("add")}
          </button>
        </div>

        <div className="surface-card flex flex-col gap-2 p-5">
          <h2 className="text-sm font-bold">
            {t("annotations")} ({annotations.length})
          </h2>
          {annotations.length === 0 ? (
            <p className="text-xs text-muted-foreground">{t("no_annotations")}</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {annotations.map((a) => (
                <li key={a.id} className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
                  <span className="rounded bg-card px-1.5 py-0.5 font-bold">{a.page}</span>
                  <span className="min-w-0 flex-1 truncate">{a.label}</span>
                  <button
                    onClick={() => setAnnotations((p) => p.filter((x) => x.id !== a.id))}
                    aria-label={t("remove")}
                    className="text-destructive"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={() => {
            setFile(null);
            docRef.current = null;
            setAnnotations([]);
          }}
          className="rounded-xl border border-border px-3 py-2.5 text-xs font-bold hover:bg-muted"
        >
          {t("clear")}
        </button>
      </aside>
    </div>
  );
}
