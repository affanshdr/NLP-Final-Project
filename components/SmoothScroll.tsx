"use client";

import { useEffect, type ReactNode } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

declare global {
  interface Window {
    lenis?: Lenis;
  }
}

// Satu instance Lenis untuk SELURUH halaman.
// framer-motion (TentangSection) & GSAP (TimSection) sama-sama membaca
// posisi scroll window yang sudah dihaluskan Lenis.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // autoRaf:false WAJIB karena RAF dijalankan manual lewat gsap.ticker di
    // bawah. Tanpa ini, Lenis versi baru menjalankan loop RAF KEDUA -> dua kali
    // update per frame -> jitter/hentakan (makin terasa saat konten berat).
    const lenis = new Lenis({ lerp: 0.12, smoothWheel: true, autoRaf: false });

    // Sinkronkan ScrollTrigger tiap Lenis scroll.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Jalankan Lenis lewat ticker GSAP (satu RAF loop untuk semuanya).
    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Akses global opsional, mis. anchor scroll: window.lenis?.scrollTo("#tim")
    window.lenis = lenis;

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.off("scroll", onScroll);
      lenis.destroy();
      window.lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}