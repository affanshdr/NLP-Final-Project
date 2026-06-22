"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CometCard } from "@/components/tim-section/CometCard";

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

export default function TimSection() {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const textRefs = useRef<Array<HTMLDivElement | null>>([]);
  const headRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    const texts = textRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!pinRef.current || cards.length === 0) return;

    // Skala kartu saat "maju penuh".
    const FORWARD_SCALE = 1.5;

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
        <header ref={headRef} className="tm-head">
          <h2>Anggota Tim</h2>
          <p>Kelompok 2 — Pemrosesan Bahasa Alami</p>
        </header>

        {MEMBERS.map((m, i) => {
          const placeholder = {
            background: `linear-gradient(135deg, ${m.gradient[0]}, ${m.gradient[1]})`,
          };
          return (
            <CometCard
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
            </CometCard>
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