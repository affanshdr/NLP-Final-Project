"use client";

import { useState } from "react";
import ComparePanel from "@/components/compare-panel/ComparePanel";
import type { DiffToken, StoredFileMeta } from "@/lib/types";

interface Props {
  original: string;
  corrected: string;
  confidence: number;
  diff: DiffToken[];
  changed: boolean;
  truncated: boolean;
  file: File | null;
  meta: StoredFileMeta | null;
}

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function ResultView(props: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard?.writeText(props.corrected);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // abaikan jika clipboard tidak tersedia
    }
  };

  return (
    <>
      {props.truncated && (
        <p className="hint-warn">
          ⚠️ Teks cukup panjang — hanya sebagian yang dikoreksi untuk demo.
        </p>
      )}

      <ComparePanel
        original={props.original}
        file={props.file}
        meta={props.meta}
        diffTokens={props.diff}
        correctedText={props.corrected}
        changed={props.changed}
      />

      <div className="koreksi-card__footer">
        <button
          type="button"
          className="copy-btn"
          onClick={handleCopy}
          aria-live="polite"
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Tersalin" : "Salin"}
        </button>
      </div>
    </>
  );
}