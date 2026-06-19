"use client";

import { useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from "react";
import { ContainerScroll } from "@/components/tentang-section/ContainerScroll";
import { TestimonialsColumn } from "@/components/tentang-section/ExplainCollumn";

const GripIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <circle cx="9" cy="5" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
);

const appConcepts = [
  {
    text: "Frontend dibangun dengan Next.js dan React.",
    name: "Next.js",
    role: "Frontend Framework",
  },
  {
    text: "API Route menghubungkan frontend ke layanan koreksi di backend.",
    name: "API Routes",
    role: "Jembatan Backend",
  },
  {
    text: "Styling menggunakan plain CSS yang ringan tanpa dependensi tambahan.",
    name: "Plain CSS",
    role: "Styling",
  },
  {
    text: "Antarmuka disusun dari komponen React yang bersih.",
    name: "Komponen React",
    role: "UI Modular",
  },
  {
    text: "Animasi halus pada hero, kartu, dan transisi memakai framer-motion.",
    name: "framer-motion",
    role: "Animasi",
  },
  {
    text: "Perpindahan antara halaman Beranda dan Koreksi memakai routing Next.js.",
    name: "Navigasi",
    role: "Routing Halaman",
  },
];

const modelConcepts = [
  {
    text: "Model mT5 melakukan koreksi ejaan dan tata bahasa berbasis Transformer.",
    name: "mT5",
    role: "Seq2Seq Transformer",
  },
  {
    text: "Model di-fine-tune pada data bahasa Indonesia agar hasilnya relevan.",
    name: "Fine-Tuning",
    role: "Pelatihan",
  },
  {
    text: "Kualitas koreksi diukur dengan metrik seperti BLEU dan WER.",
    name: "Evaluasi",
    role: "BLEU & WER",
  },
  {
    text: "Teks dipecah menjadi token memakai SentencePiece sebelum diproses model.",
    name: "Tokenisasi",
    role: "SentencePiece",
  },
  {
    text: "Permintaan koreksi dikirim ke endpoint dan dikembalikan sebagai teks yang diperbaiki.",
    name: "Inferensi",
    role: "POST /correct",
  },
  {
    text: "Model belajar dari korpus bahasa Indonesia untuk memahami pola kesalahan umum.",
    name: "Dataset",
    role: "Korpus Indonesia",
  },
];

function clientXFromEvent(e: ReactMouseEvent | ReactTouchEvent): number {
  if ("touches" in e && e.touches.length > 0) return e.touches[0].clientX;
  if ("changedTouches" in e && e.changedTouches.length > 0) {
    return e.changedTouches[0].clientX;
  }
  return (e as ReactMouseEvent).clientX;
}

export default function TentangSection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inset, setInset] = useState(50);
  const [dragging, setDragging] = useState(false);

  // Batas geser slider: tiap sisi maksimal terungkap 75%,
  // jadi pembatas hanya bisa bergerak di rentang 25%-75%.
  const MIN_INSET = 20;
  const MAX_INSET = 80;

  const moveTo = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const percentage = ((clientX - rect.left) / rect.width) * 100;
    setInset(Math.min(MAX_INSET, Math.max(MIN_INSET, percentage)));
  };

  const handleMove = (e: ReactMouseEvent | ReactTouchEvent) => {
    if (!dragging) return;
    moveTo(clientXFromEvent(e));
  };
  const startDrag = (e: ReactMouseEvent | ReactTouchEvent) => {
    setDragging(true);
    moveTo(clientXFromEvent(e));
  };
  const stopDrag = () => setDragging(false);

  const dividerStyle = { left: inset + "%" };
  const clipStyle = { clipPath: "inset(0 0 0 " + inset + "%)" };

  // Kecepatan auto-scroll tiap kolom dalam PIKSEL per detik.
  // Dipakai SAMA di kedua sisi (hitam & putih) -> kecepatan visual seragam,
  // tidak terpengaruh tinggi/panjang teks kartu.
  const COLUMN_SPEEDS = [35, 35, 35];

  return (
    <section className="tentang" id="tentang">
      <ContainerScroll>
        <div
          ref={containerRef}
          className="compare"
          onMouseMove={handleMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
          onTouchMove={handleMove}
          onTouchEnd={stopDrag}
        >
          {/* Sisi hitam (dasar) — teks kiri, kartu condong ke tengah */}
          <div className="cmp-panel cmp-panel--dark">
            <div className="cmp-text">
              <span className="cmp-badge cmp-badge--light">Aplikasi</span>
              <h2 className="cmp-heading">Ejaku, koreksi dalam sekali klik</h2>
              <p className="cmp-desc">
                Antarmuka web ringan berbasis Next.js. Tempel teks atau unggah
                dokumen, lalu Ejaku merapikan ejaan &amp; tata bahasa Indonesia
                secara otomatis.
              </p>
            </div>
            <div className="cmp-cards">
              <TestimonialsColumn
                testimonials={appConcepts.slice(0, 3)}
                speed={COLUMN_SPEEDS[0]}
              />
              <TestimonialsColumn
                testimonials={appConcepts.slice(2, 5)}
                speed={COLUMN_SPEEDS[1]}
                className="tcol--md"
              />
              <TestimonialsColumn
                testimonials={appConcepts.slice(3, 6)}
                speed={COLUMN_SPEEDS[2]}
                className="tcol--lg"
              />
            </div>
          </div>

          {/* Sisi putih (di-clip) — teks kanan, kartu condong ke tengah */}
          <div className="cmp-panel cmp-panel--light" style={clipStyle}>
            <div className="cmp-cards">
              <TestimonialsColumn
                testimonials={modelConcepts.slice(0, 3)}
                speed={COLUMN_SPEEDS[0]}
              />
              <TestimonialsColumn
                testimonials={modelConcepts.slice(2, 5)}
                speed={COLUMN_SPEEDS[1]}
                className="tcol--md"
              />
              <TestimonialsColumn
                testimonials={modelConcepts.slice(3, 6)}
                speed={COLUMN_SPEEDS[2]}
                className="tcol--lg"
              />
            </div>
            <div className="cmp-text cmp-text--right">
              <span className="cmp-badge cmp-badge--dark">Model</span>
              <h2 className="cmp-heading">Ditenagai mT5 berbasis Transformer</h2>
              <p className="cmp-desc">
                Model mT5 yang di-fine-tune pada korpus bahasa Indonesia untuk
                mengoreksi ejaan dan tata bahasa secara kontekstual, bukan
                sekadar mencocokkan kata.
              </p>
            </div>
          </div>

          {/* Handle / slider */}
          <div className="compare__divider" style={dividerStyle}>
            <button
              type="button"
              className="compare__grip"
              aria-label="Geser pembatas"
              onMouseDown={startDrag}
              onTouchStart={startDrag}
              onMouseUp={stopDrag}
              onTouchEnd={stopDrag}
            >
              <GripIcon />
            </button>
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}