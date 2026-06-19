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
  return (
    <div className="compare-panel">
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
            <DiffSide tokens={props.diffTokens} side="original" />
          ) : (
            <p className="diff">{props.original}</p>
          )}
        </div>
      </div>
      <div className="compare-col">
        <span className="compare-col__label">Hasil Koreksi</span>
        <div className="compare-body">
          {props.changed ? (
            <DiffSide tokens={props.diffTokens} side="corrected" />
          ) : (
            <p className="no-change">Tidak ditemukan kesalahan. 🎉</p>
          )}
        </div>
      </div>
    </div>
  );
}