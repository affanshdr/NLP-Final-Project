import { NextRequest, NextResponse } from "next/server";
import type { CorrectionResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Body JSON tidak valid." },
      { status: 400 },
    );
  }

  const text = (body.text ?? "").trim();
  if (!text) {
    return NextResponse.json(
      { error: "Field 'text' wajib diisi." },
      { status: 400 },
    );
  }

  const backendUrl = process.env.MODEL_API_URL;

  // === Mode integrasi: teruskan ke backend Anisa ===
  if (backendUrl) {
    try {
      const res = await fetch(`${backendUrl.replace(/\/$/, "")}/correct`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch {
      return NextResponse.json(
        { error: "Gagal menghubungi backend model." },
        { status: 502 },
      );
    }
  }

  // === Mode mock: simulasi koreksi sederhana ===
  const corrected = mockCorrect(text);
  const response: CorrectionResponse = {
    original: text,
    corrected,
    confidence: mockConfidence(text, corrected),
  };
  await new Promise((r) => setTimeout(r, 350)); // simulasi latensi
  return NextResponse.json(response, { status: 200 });
}

const RULES: Array<[RegExp, string]> = [
  [/\bgw\b/gi, "saya"],
  [/\bgue\b/gi, "saya"],
  [/\baku\b/gi, "saya"],
  [/\bdikampus\b/gi, "di kampus"],
  [/\bdirumah\b/gi, "di rumah"],
  [/\bdisini\b/gi, "di sini"],
  [/\bnungguin\b/gi, "menunggu"],
  [/\bgak\b/gi, "tidak"],
  [/\bnggak\b/gi, "tidak"],
  [/\bgimana\b/gi, "bagaimana"],
  [/\bkenapa\b/gi, "mengapa"],
  [/\budah\b/gi, "sudah"],
  [/\bgaada\b/gi, "tidak ada"],
  [/\btrus\b/gi, "terus"],
  [/\bbgt\b/gi, "banget"],
  [/\bsmua\b/gi, "semua"],
  [/\bdgn\b/gi, "dengan"],
  [/\byg\b/gi, "yang"],
];

function mockCorrect(text: string): string {
  let out = text;
  for (const [re, rep] of RULES) out = out.replace(re, rep);
  // Kapitalisasi awal kalimat.
  out = out.replace(
    /(^\s*|[.!?]\s+)([a-z])/g,
    (_m, p1: string, p2: string) => p1 + p2.toUpperCase(),
  );
  return out;
}

function mockConfidence(a: string, b: string): number {
  if (a === b) return 0.99;
  const changes = Math.abs(a.length - b.length) + 1;
  const score = Math.max(
    0.6,
    Math.min(0.97, 0.95 - changes / Math.max(a.length, 1)),
  );
  return Math.round(score * 100) / 100;
}
