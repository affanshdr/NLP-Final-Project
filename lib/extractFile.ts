import { loadPdfjs } from "./pdf";

export type SupportedExt = "pdf" | "docx" | "txt";

export const ACCEPTED_EXT: SupportedExt[] = ["pdf", "docx", "txt"];
export const MAX_FILE_MB = 5;

export function getExt(fileName: string): string {
  const idx = fileName.lastIndexOf(".");
  return idx >= 0 ? fileName.slice(idx + 1).toLowerCase() : "";
}

export function isSupported(fileName: string): boolean {
  return (ACCEPTED_EXT as string[]).includes(getExt(fileName));
}

// Ekstraksi teks dilakukan sepenuhnya di sisi browser (client-side).
export async function extractText(file: File): Promise<string> {
  const ext = getExt(file.name);
  switch (ext) {
    case "txt":
      return (await file.text()).trim();
    case "docx":
      return extractDocx(file);
    case "pdf":
      return extractPdf(file);
    default:
      throw new Error(
        `Format .${ext} tidak didukung. Gunakan PDF, .docx, atau .txt.`,
      );
  }
}

async function extractDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
}

async function extractPdf(file: File): Promise<string> {
  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;
  let text = "";
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const strings = content.items.map((it: any) => ("str" in it ? it.str : ""));
    text += strings.join(" ") + "\n";
  }
  return text.trim();
}
