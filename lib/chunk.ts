export interface ChunkLimitResult {
  chunks: string[];
  truncated: boolean;
}

const MAX_SENTENCES = 30;
const MAX_CHARS = 5000;

export function splitSentences(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const matches = normalized.match(/[^.!?\n]+[.!?]*\s*|\n+/g);
  return (matches ?? [normalized])
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

export function limitForDemo(text: string): ChunkLimitResult {
  let truncated = false;
  let working = text;
  if (working.length > MAX_CHARS) {
    working = working.slice(0, MAX_CHARS);
    truncated = true;
  }
  let chunks = splitSentences(working);
  if (chunks.length > MAX_SENTENCES) {
    chunks = chunks.slice(0, MAX_SENTENCES);
    truncated = true;
  }
  return { chunks, truncated };
}

export const CHUNK_LIMITS = { MAX_SENTENCES, MAX_CHARS };
