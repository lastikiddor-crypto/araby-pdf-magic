/** Lazily loads pdf.js in the browser only. Never import this at module scope on the server. */
export async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  return pdfjs;
}

export async function extractText(file: File): Promise<string> {
  const pdfjs = await loadPdfjs();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    parts.push(line);
  }
  return parts.join("\n\n");
}

/** Renders text into a transparent PNG so any script (incl. Arabic) exports correctly. */
export function textToImage(text: string, fontSize: number, color: string) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const font = `600 ${fontSize}px Cairo, sans-serif`;
  ctx.font = font;
  const width = Math.ceil(ctx.measureText(text).width) + 16;
  const height = Math.ceil(fontSize * 1.6);
  canvas.width = Math.max(width, 8);
  canvas.height = height;
  const c = canvas.getContext("2d")!;
  c.font = font;
  c.fillStyle = color;
  c.textBaseline = "middle";
  c.fillText(text, 8, height / 2);
  return { dataUrl: canvas.toDataURL("image/png"), width: canvas.width, height: canvas.height };
}
