import { PDFDocument, degrees } from "pdf-lib";

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
