"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInputText, getInputFile, getInputFileMeta } from "@/lib/session";
import { wordDiff, hasChanges } from "@/lib/diff";
import { limitForDemo } from "@/lib/chunk";
import type { CorrectionResponse, DiffToken, StoredFileMeta } from "@/lib/types";

export type CorrectionState =
  | { phase: "loading"; progress?: string }
  | { phase: "error"; message: string }
  | {
      phase: "done";
      original: string;
      corrected: string;
      confidence: number;
      diff: DiffToken[];
      changed: boolean;
      truncated: boolean;
    };

export function useCorrection() {
  const router = useRouter();
  const [state, setState] = useState<CorrectionState>({ phase: "loading" });
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState<StoredFileMeta | null>(null);

  useEffect(() => {
    const text = getInputText();
    if (!text || !text.trim()) {
      router.replace("/");
      return;
    }
    setFile(getInputFile());
    setMeta(getInputFileMeta());
    void run(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(fullText: string) {
    try {
      const { chunks, truncated } = limitForDemo(fullText);
      const usable = chunks.length > 0 ? chunks : [fullText];
      const correctedParts: string[] = [];
      let confidenceSum = 0;

      for (let i = 0; i < usable.length; i++) {
        setState({ phase: "loading", progress: `Mengoreksi ${i + 1}/${usable.length} bagian…` });
        const res = await fetch("/api/correct", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: usable[i] }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error ?? `Gagal mengoreksi (status ${res.status}).`);
        }
        const data = (await res.json()) as CorrectionResponse;
        correctedParts.push(data.corrected);
        confidenceSum += data.confidence;
      }

      const original = usable.join(" ");
      const corrected = correctedParts.join(" ");
      const diff = wordDiff(original, corrected);
      setState({
        phase: "done",
        original,
        corrected,
        confidence: confidenceSum / usable.length,
        diff,
        changed: hasChanges(diff),
        truncated,
      });
    } catch (e) {
      setState({
        phase: "error",
        message: e instanceof Error ? e.message : "Terjadi kesalahan.",
      });
    }
  }

  return { state, file, meta };
}