"use client";

import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RGB = [number, number, number];
type Palette = { c1: RGB; c2: RGB };

type Member = {
  name: string;
  role: string;
  photo?: string;
  gradient: [string, string];
};

// Berapa "layar penuh" scroll untuk SETIAP anggota.
const SCROLL_PER_MEMBER = 3;

const MEMBERS: Member[] = [
  {
    name: "Halim Elsa Putra",
    role: "Frontend Engineer",
    photo: "/img/halim.webp",
    gradient: ["#a855f7", "#581c87"],
  },
  {
    name: "Anisa Ramadhani",
    role: "Backend Engineer",
    photo: "/img/anisa.webp",
    gradient: ["#0ea5e9", "#0c4a6e"],
  },
  {
    name: "Affan Suhendar",
    role: "Model & Machine Learning",
    photo: "/img/affan.webp",
    gradient: ["#f97316", "#7c2d12"],
  },
];

// ============================================================================
// UTIL WARNA (adaptasi dari gradientslider by Clement Grellier / Codrops)
// ============================================================================

function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): RGB {
  h /= 360;
  let r: number;
  let g: number;
  let b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

// Saturasi ditekan supaya glow lembut/muted dan menyatu dengan putih.
function tint(rgb: RGB, l: number): RGB {
  const [h, s] = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  return hslToRgb(h, Math.max(0.16, Math.min(0.5, s)), l);
}

// Ekstrak dua warna dominan dari foto via histogram hue x saturation.
function extractColors(img: HTMLImageElement): Palette | null {
  try {
    const MAX = 48;
    const ratio =
      img.naturalWidth && img.naturalHeight
        ? img.naturalWidth / img.naturalHeight
        : 1;
    const tw = ratio >= 1 ? MAX : Math.max(16, Math.round(MAX * ratio));
    const th = ratio >= 1 ? Math.max(16, Math.round(MAX / ratio)) : MAX;

    const canvas = document.createElement("canvas");
    canvas.width = tw;
    canvas.height = th;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, tw, th);
    const data = ctx.getImageData(0, 0, tw, th).data;

    const H_BINS = 36;
    const S_BINS = 5;
    const SIZE = H_BINS * S_BINS;
    const wSum = new Float32Array(SIZE);
    const rSum = new Float32Array(SIZE);
    const gSum = new Float32Array(SIZE);
    const bSum = new Float32Array(SIZE);

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3] / 255;
      if (a < 0.05) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const [h, s, l] = rgbToHsl(r, g, b);
      if (l < 0.1 || l > 0.92 || s < 0.08) continue;
      const w = a * (s * s) * (1 - Math.abs(l - 0.5) * 0.6);
      const hi = Math.max(
        0,
        Math.min(H_BINS - 1, Math.floor((h / 360) * H_BINS)),
      );
      const si = Math.max(0, Math.min(S_BINS - 1, Math.floor(s * S_BINS)));
      const idx = hi * S_BINS + si;
      wSum[idx] += w;
      rSum[idx] += r * w;
      gSum[idx] += g * w;
      bSum[idx] += b * w;
    }

    let pIdx = -1;
    let pW = 0;
    for (let i = 0; i < SIZE; i++) {
      if (wSum[i] > pW) {
        pW = wSum[i];
        pIdx = i;
      }
    }
    if (pIdx < 0 || pW <= 0) return null;

    const pHue = Math.floor(pIdx / S_BINS) * (360 / H_BINS);
    let sIdx = -1;
    let sW = 0;
    for (let i = 0; i < SIZE; i++) {
      const w = wSum[i];
      if (w <= 0) continue;
      const h = Math.floor(i / S_BINS) * (360 / H_BINS);
      let dh = Math.abs(h - pHue);
      dh = Math.min(dh, 360 - dh);
      if (dh >= 25 && w > sW) {
        sW = w;
        sIdx = i;
      }
    }

    const avgRGB = (idx: number): RGB => {
      const w = wSum[idx] || 1e-6;
      return [
        Math.round(rSum[idx] / w),
        Math.round(gSum[idx] / w),
        Math.round(bSum[idx] / w),
      ];
    };

    const [pr, pg, pb] = avgRGB(pIdx);
    const [h1, s1raw] = rgbToHsl(pr, pg, pb);
    const s1 = Math.max(0.45, Math.min(1, s1raw * 1.15));
    const c1 = hslToRgb(h1, s1, 0.5);

    let c2: RGB;
    if (sIdx >= 0 && sW >= pW * 0.6) {
      const [sr, sg, sb] = avgRGB(sIdx);
      const [h2, s2raw] = rgbToHsl(sr, sg, sb);
      const s2 = Math.max(0.45, Math.min(1, s2raw * 1.05));
      c2 = hslToRgb(h2, s2, 0.72);
    } else {
      c2 = hslToRgb(h1, s1, 0.72);
    }
    return { c1, c2 };
  } catch {
    return null;
  }
}

export default function TimSection() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const headRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const texts = textRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!pinRef.current || cards.length === 0) return;

    // ---------------------------------------------------------------------
    // BACKGROUND GRADIENT REAKTIF (warna mengikuti anggota yang aktif)
    // ---------------------------------------------------------------------
    const palette: Palette[] = MEMBERS.map((m) => ({
      c1: hexToRgb(m.gradient[0]),
      c2: hexToRgb(m.gradient[1]),
    }));

    // Warna (pastel) untuk anggota ke-i.
    const colorFor = (i: number) => {
      const pal = palette[i] || palette[0];
      const a = tint(pal.c1, 0.72);
      const b = tint(pal.c2, 0.82);
      return { r1: a[0], g1: a[1], b1: a[2], r2: b[0], g2: b[1], b2: b[2] };
    };

    // Skala kartu saat "maju penuh" (harus sama dengan timeline di bawah).
    const FORWARD_SCALE = 1.5;

    // Untuk anggota yang punya FOTO: ambil warna dominan dari gambar itu
    // sendiri supaya benar-benar "mengikuti gambar".
    MEMBERS.forEach((m, i) => {
      if (!m.photo) return;
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.onload = () => {
        const ex = extractColors(im);
        if (ex) palette[i] = ex;
      };
      im.src = m.photo;
    });

    // Loop menggambar dua radial-gradient yang melayang pelan.
    let raf = 0;
    const draw = () => {
      const canvas = canvasRef.current;
      const pin = pinRef.current;
      const ctx = canvas?.getContext("2d", { alpha: true });
      if (canvas && pin && ctx) {
        const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
        const w = pin.clientWidth;
        const h = pin.clientHeight;
        const tw = Math.floor(w * dpr);
        const th = Math.floor(h * dpr);
        if (canvas.width !== tw || canvas.height !== th) {
          canvas.width = tw;
          canvas.height = th;
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        ctx.clearRect(0, 0, w, h);

        // Kartu mana yang paling "maju" + seberapa jauh majunya (0..1).
        // Saat semua kartu diam (scale 1) -> intensity 0 -> background putih.
        // Makin maju kartunya, makin pekat warnanya (nampak perlahan).
        let leadIdx = 0;
        let maxScale = 1;
        cards.forEach((card, i) => {
          const sc = Number(gsap.getProperty(card, "scale")) || 1;
          if (sc > maxScale) {
            maxScale = sc;
            leadIdx = i;
          }
        });
        const intensity = Math.max(
          0,
          Math.min(1, (maxScale - 1) / (FORWARD_SCALE - 1)),
        );
        const col = colorFor(leadIdx);

        // Glow dipusatkan DI SEKITAR kartu yang sedang maju (mengikuti
        // posisinya), bukan mewarnai seluruh layar. Radius seukuran kartu
        // supaya warna hanya muncul di sekelilingnya lalu memudar.
        const leadCard = cards[leadIdx];
        const lx = Number(gsap.getProperty(leadCard, "x")) || 0;
        const ly = Number(gsap.getProperty(leadCard, "y")) || 0;
        const cardW = leadCard.offsetWidth * maxScale;
        const cardH = leadCard.offsetHeight * maxScale;
        const centerX = w * 0.5 + lx;
        const centerY = h * 0.5 + ly;

        // Gerakan melayang halus di sekitar kartu.
        const t = performance.now() * 0.0004;
        const driftX = Math.cos(t) * cardW * 0.08;
        const driftY = Math.sin(t * 0.8) * cardH * 0.08;

        const glowR = Math.max(cardW, cardH) * 0.95;
        const a1v = 0.5 * intensity;
        const a2v = 0.32 * intensity;

        const gx1 = centerX + driftX;
        const gy1 = centerY + driftY;
        const g1 = ctx.createRadialGradient(gx1, gy1, 0, gx1, gy1, glowR);
        g1.addColorStop(0, `rgba(${col.r1},${col.g1},${col.b1},${a1v})`);
        g1.addColorStop(1, `rgba(${col.r1},${col.g1},${col.b1},0)`);
        ctx.fillStyle = g1;
        ctx.fillRect(0, 0, w, h);

        const gx2 = centerX - driftX * 0.6;
        const gy2 = centerY - driftY * 0.6;
        const g2 = ctx.createRadialGradient(gx2, gy2, 0, gx2, gy2, glowR * 0.8);
        g2.addColorStop(0, `rgba(${col.r2},${col.g2},${col.b2},${a2v})`);
        g2.addColorStop(1, `rgba(${col.r2},${col.g2},${col.b2},0)`);
        ctx.fillStyle = g2;
        ctx.fillRect(0, 0, w, h);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    // ---------------------------------------------------------------------
    // TIMELINE KARTU (zoom kiri bergiliran)
    // ---------------------------------------------------------------------
    let tl: gsap.core.Timeline | null = null;

    const build = () => {
      tl?.scrollTrigger?.kill();
      tl?.kill();

      gsap.set(cards, { xPercent: -50, yPercent: -50 });
      gsap.set(texts, { yPercent: -50 });

      const cardW = cards[0].offsetWidth;
      const gap = cardW * 0.14;
      const step = cardW + gap;
      const restX = cards.map((_, i) => (i - (cards.length - 1) / 2) * step);
      const leftX = -window.innerWidth * 0.22;

      cards.forEach((card, i) => {
        gsap.set(card, {
          x: restX[i],
          y: 0,
          scale: 1,
          autoAlpha: 1,
          zIndex: 1,
        });
      });
      gsap.set(texts, { autoAlpha: 0, x: 40 });
      gsap.set(headRef.current, { autoAlpha: 1 });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () =>
            "+=" + window.innerHeight * SCROLL_PER_MEMBER * cards.length,
          scrub: 1,
          pin: pinRef.current,
          invalidateOnRefresh: true,
        },
      });

      cards.forEach((card, i) => {
        const others = cards.filter((_, j) => j !== i);

        tl!.set(card, { zIndex: 5 });
        tl!.to(others, { autoAlpha: 0, duration: 0.4 }, "<");
        tl!.to(headRef.current, { autoAlpha: 0, duration: 0.4 }, "<");
        tl!.to(card, { x: leftX, scale: FORWARD_SCALE, duration: 0.6 }, "<");
        tl!.to(texts[i], { autoAlpha: 1, x: 0, duration: 0.4 }, "-=0.2");

        tl!.to({}, { duration: 0.7 });

        tl!.to(texts[i], { autoAlpha: 0, x: 40, duration: 0.3 });
        tl!.to(card, { x: restX[i], scale: 1, duration: 0.6 }, "<");
        tl!.to(others, { autoAlpha: 1, duration: 0.4 }, "<");
        tl!.to(headRef.current, { autoAlpha: 1, duration: 0.4 }, "<");
        tl!.set(card, { zIndex: 1 });
      });
    };

    build();

    const onLoad = () => ScrollTrigger.refresh();
    const imgs = Array.from(
      pinRef.current.querySelectorAll("img"),
    ) as HTMLImageElement[];
    imgs.forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", onLoad, { once: true });
      img.addEventListener("error", onLoad, { once: true });
    });
    window.addEventListener("load", onLoad);

    let resizeTimer: number;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        ScrollTrigger.refresh();
      }, 250);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onLoad);
      tl?.scrollTrigger?.kill();
      tl?.kill();
    };
  }, []);

  return (
    <section className="tm-stage" id="tim">
      <div ref={pinRef} className="tm-pin">
        <canvas ref={canvasRef} className="tm-bg" aria-hidden="true" />

        <header ref={headRef} className="tm-head">
          <h2>Anggota Tim</h2>
          <p>Kelompok 2 — Pemrosesan Bahasa Alami</p>
        </header>

        {MEMBERS.map((m, i) => {
          const placeholder = {
            background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})`,
          };
          return (
            <div
              key={m.name}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="tm-card"
            >
              {m.photo ? (
                <img src={m.photo} alt={m.name} />
              ) : (
                <div className="tm-ph" style={placeholder} />
              )}
            </div>
          );
        })}

        {MEMBERS.map((m, i) => (
          <div
            key={m.name}
            ref={(el) => {
              textRefs.current[i] = el;
            }}
            className="tm-text"
          >
            <h3>{m.name}</h3>
            <p>{m.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}