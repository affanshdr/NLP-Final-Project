"use client";

import { useMemo, useState } from "react";
import DocViewer from "./DocViewer";
import DiffSide from "./DiffSide";
import type { DiffToken, StoredFileMeta } from "@/lib/types";

interface Props {
  original: string;
  file: File | null;
  meta: StoredFileMeta | null;
  diffTokens: DiffToken[];
  correctedText: string;
  changed: boolean;
}

export default function ComparePanel(props: Props) {
  const [focusGroup, setFocusGroup] = useState<number | null>(null);

  // Beri ID kelompok ke tiap token. Satu "perubahan" = sekumpulan token
  // delete+insert yang berurutan (mis. "aq" -> "aku" jadi satu group).
  const groups = useMemo(() => {
    const result: Array<number | null> = [];
    let current = -1;
    let inGroup = false;
    for (const t of props.diffTokens) {
      if (t.type === "equal") {
        result.push(null);
        inGroup = false;
      } else {
        if (!inGroup) {
          current += 1;
          inGroup = true;
        }
        result.push(current);
      }
    }
    return result;
  }, [props.diffTokens]);

  const focusing = focusGroup !== null;

  return (
    <div
      className={focusing ? "compare-panel result-focusing" : "compare-panel"}
      onClick={() => setFocusGroup(null)}
    >
      <div className="compare-col">
        <span className="compare-col__label">Teks Asli</span>
        <div className="compare-body">
          {props.file ? (
            <DocViewer
              file={props.file}
              meta={props.meta}
              fallbackText={props.original}
            />
          ) : props.changed ? (
            <DiffSide
              tokens={props.diffTokens}
              groups={groups}
              side="original"
              focusGroup={focusGroup}
              onFocusGroup={setFocusGroup}
            />
          ) : (
            <p className="diff">{props.original}</p>
          )}
        </div>
      </div>
      <div className="compare-col">
        <span className="compare-col__label">Hasil Koreksi</span>
        <div className="compare-body">
          {props.changed ? (
            <DiffSide
              tokens={props.diffTokens}
              groups={groups}
              side="corrected"
              focusGroup={focusGroup}
              onFocusGroup={setFocusGroup}
            />
          ) : (
            <p className="no-change">Tidak ditemukan kesalahan. 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}