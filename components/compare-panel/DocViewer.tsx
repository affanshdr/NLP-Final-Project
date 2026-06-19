"use client";

import { useEffect, useRef, useState } from "react";
import { loadPdfjs } from "@/lib/pdf";
import type { StoredFileMeta } from "@/lib/types";

interface Props {
  file: File | null;
  meta: StoredFileMeta | null;
  fallbackText: string;
}

export default function DocViewer({ file, meta, fallbackText }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      setError("");
      const el = containerRef.current;
      if (!el) return;
      el.innerHTML = "";
      if (!file || !meta) return;
      try {
        if (meta.ext === "docx") {
          const docx = await import("docx-preview");
          const buf = await file.arrayBuffer();
          if (cancelled) return;
          await docx.renderAsync(buf, el);
        } else if (meta.ext === "pdf") {
          await renderPdf(file, el, () => cancelled);
        } else {
          const txt = await file.text();
          if (cancelled) return;
          const pre = document.createElement("pre");
          pre.className = "doc-txt";
          pre.textContent = txt;
          el.appendChild(pre);
        }
      } catch {
        if (!cancelled)
          setError(
            "Tidak dapat menampilkan dokumen asli. Menampilkan teks ekstraksi saja.",
          );
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [file, meta]);

  // Input diketik manual (tanpa file): tampilkan teks asli.
  if (!file || !meta) {
    return <pre className="doc-txt">{fallbackText}</pre>;
  }

  return (
    <div className="doc-viewer">
      <div ref={containerRef} className="doc-render" />
      {error && (
        <>
          <p className="hint-error">{error}</p>
          <pre className="doc-txt">{fallbackText}</pre>
        </>
      )}
    </div>
  );
}

async function renderPdf(
  file: File,
  el: HTMLElement,
  isCancelled: () => boolean,
) {
  const pdfjs = await loadPdfjs();
  const data = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data }).promise;
  for (let p = 1; p <= doc.numPages; p++) {
    if (isCancelled()) return;
    const page = await doc.getPage(p);
    const viewport = page.getViewport({ scale: 1.2 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    canvas.className = "doc-pdf-page";
    el.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    await page.render({ canvasContext: ctx, viewport }).promise;
  }
}
