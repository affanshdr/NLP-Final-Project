import type { StoredFileMeta } from "./types";

const TEXT_KEY = "gec:inputText";
const META_KEY = "gec:fileMeta";

// File asli disimpan di memori modul. Karena navigasi Next.js bersifat
// client-side (SPA), nilai ini bertahan saat pindah dari Beranda ke /koreksi.
let inMemoryFile: File | null = null;

export function setInputText(text: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(TEXT_KEY, text);
}

export function getInputText(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TEXT_KEY);
}

export function setInputFile(
  file: File | null,
  meta: StoredFileMeta | null,
): void {
  inMemoryFile = file;
  if (typeof window === "undefined") return;
  if (meta) sessionStorage.setItem(META_KEY, JSON.stringify(meta));
  else sessionStorage.removeItem(META_KEY);
}

export function getInputFile(): File | null {
  return inMemoryFile;
}

export function getInputFileMeta(): StoredFileMeta | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(META_KEY);
  return raw ? (JSON.parse(raw) as StoredFileMeta) : null;
}

export function clearInput(): void {
  inMemoryFile = null;
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(TEXT_KEY);
  sessionStorage.removeItem(META_KEY);
}
