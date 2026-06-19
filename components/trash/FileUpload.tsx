"use client";

import { useRef, useState } from "react";
import {
  extractText,
  getExt,
  isSupported,
  MAX_FILE_MB,
} from "@/lib/extractFile";
import type { StoredFileMeta } from "@/lib/types";

interface Props {
  onExtracted: (
    text: string,
    meta: StoredFileMeta | null,
    file: File | null,
  ) => void;
  disabled?: boolean;
}

export default function FileUpload({ onExtracted, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setStatus("");
    if (!isSupported(file.name)) {
      setError(
        "Format tidak didukung. Gunakan PDF, .docx, atau .txt (.doc lama tidak didukung).",
      );
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setError(`Ukuran file melebihi ${MAX_FILE_MB} MB.`);
      return;
    }
    setStatus("Mengekstrak teks…");
    try {
      const text = await extractText(file);
      if (!text.trim()) {
        setError(
          "Tidak ada teks yang bisa dibaca dari file ini (kemungkinan hasil scan/gambar).",
        );
        setStatus("");
        return;
      }
      const meta: StoredFileMeta = {
        name: file.name,
        type: file.type,
        ext: getExt(file.name),
        size: file.size,
      };
      setStatus("Membuka halaman koreksi…");
      onExtracted(text, meta, file);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membaca file.");
      setStatus("");
    }
  }

  function openPicker() {
    if (!disabled) inputRef.current?.click();
  }

  return (
    <div
      className={`file-upload${disabled ? " is-disabled" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (disabled) return;
        const f = e.dataTransfer.files?.[0];
        if (f) void handleFile(f);
      }}
      onClick={openPicker}
      role="button"
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        hidden
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
        }}
      />
      <p>📎 Klik atau seret file ke sini (PDF, Word .docx, atau .txt)</p>
      <p className="file-upload-sub">
        File akan langsung dibuka di halaman koreksi.
      </p>
      {status && <p className="hint-ok">{status}</p>}
      {error && <p className="hint-error">{error}</p>}
    </div>
  );
}