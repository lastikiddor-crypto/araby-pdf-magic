import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";

export function downloadBlob(data: Uint8Array | Blob, filename: string) {
  const blob = data instanceof Blob ? data : new Blob([data as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const src = await PDFDocument.load(await file.arrayBuffer());
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  return out.save();
}

/** Parses "1-3, 5, 8-10" into zero-based indices bounded by total. */
export function parseRange(input: string, total: number): number[] {
  const result = new Set<number>();
  for (const chunk of input.split(",")) {
    const part = chunk.trim();
    if (!part) continue;
    const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const a = Math.min(Number(m[1]), Number(m[2]));
      const b = Math.max(Number(m[1]), Number(m[2]));
      for (let i = a; i <= b; i++) if (i >= 1 && i <= total) result.add(i - 1);
    } else if (/^\d+$/.test(part)) {
      const n = Number(part);
      if (n >= 1 && n <= total) result.add(n - 1);
    }
  }
  return [...result].sort((x, y) => x - y);
}

export async function splitPdf(file: File, range: string) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const indices = parseRange(range, src.getPageCount());
  if (!indices.length) return null;
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export async function countPages(file: File) {
  const src = await PDFDocument.load(await file.arrayBuffer());
  return src.getPageCount();
}

export async function imagesToPdf(files: File[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const isPng = file.type.includes("png") || file.name.toLowerCase().endsWith(".png");
    const img = isPng ? await out.embedPng(bytes) : await out.embedJpg(bytes);
    const page = out.addPage([img.width, img.height]);
    page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    page.setRotation(degrees(0));
  }
  return out.save();
}

function dataUrlToBytes(dataUrl: string) {
  return Uint8Array.from(atob(dataUrl.split(",")[1]!), (c) => c.charCodeAt(0));
}

/** Stamps a rotated, semi-transparent text watermark (any script) on every page. */
export async function watermarkPdf(
  file: File,
  text: string,
  opts: { opacity?: number; rotation?: number; color?: string } = {},
): Promise<Uint8Array> {
  const { textToImage } = await import("./pdfjs");
  const { opacity = 0.2, rotation = 45, color = "#ef4444" } = opts;
  const img = textToImage(text, 120, color);
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const png = await pdf.embedPng(dataUrlToBytes(img.dataUrl));
  for (const page of pdf.getPages()) {
    const { width, height } = page.getSize();
    const w = width * 0.7;
    const h = (img.height / img.width) * w;
    page.drawImage(png, {
      x: width / 2 - w / 2,
      y: height / 2 - h / 2,
      width: w,
      height: h,
      opacity,
      rotate: degrees(rotation),
    });
  }
  return pdf.save();
}

/** Rebuilds the document keeping only `keep` pages (1-based) with per-page rotation. */
export async function organizePdf(
  file: File,
  keep: number[],
  rotations: Record<number, number>,
): Promise<Uint8Array | null> {
  if (!keep.length) return null;
  const src = await PDFDocument.load(await file.arrayBuffer());
  const out = await PDFDocument.create();
  const pages = await out.copyPages(
    src,
    keep.map((n) => n - 1),
  );
  pages.forEach((p, i) => {
    const rot = rotations[keep[i]!] ?? 0;
    p.setRotation(degrees(((p.getRotation().angle + rot) % 360 + 360) % 360));
    out.addPage(p);
  });
  return out.save();
}

/** Re-renders every page as a JPEG at the given quality/scale to shrink file size. */
export async function compressPdf(file: File, quality = 0.6, scale = 1.2): Promise<Uint8Array> {
  const { loadPdfjs } = await import("./pdfjs");
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const out = await PDFDocument.create();
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport } as never).promise;
    const jpg = await out.embedJpg(dataUrlToBytes(canvas.toDataURL("image/jpeg", quality)));
    const target = out.addPage([viewport.width / scale, viewport.height / scale]);
    target.drawImage(jpg, { x: 0, y: 0, width: target.getWidth(), height: target.getHeight() });
  }
  return out.save();
}

/** Draws sequential page numbers at the bottom of each page. */
export async function addPageNumbers(
  file: File,
  position: "center" | "start" | "end" = "center",
): Promise<Uint8Array> {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  pages.forEach((page, i) => {
    const label = `${i + 1} / ${pages.length}`;
    const size = 10;
    const textWidth = font.widthOfTextAtSize(label, size);
    const { width } = page.getSize();
    const x =
      position === "center" ? width / 2 - textWidth / 2 : position === "start" ? 40 : width - 40 - textWidth;
    page.drawText(label, { x, y: 24, size, font, color: rgb(0.35, 0.35, 0.35) });
  });
  return pdf.save();
}
