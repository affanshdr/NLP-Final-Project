export type DiffOpType = "equal" | "insert" | "delete";

export interface DiffToken {
  type: DiffOpType;
  value: string;
}

// ===== Kontrak API dengan backend (Anisa) =====
export interface CorrectionRequest {
  text: string;
}

export interface CorrectionResponse {
  original: string;
  corrected: string;
  confidence: number; // 0..1
}

export interface CorrectionError {
  error: string;
}

export type InputSource = "text" | "file";

export interface StoredFileMeta {
  name: string;
  type: string; // mime type
  ext: string; // pdf | docx | txt
  size: number;
}
