"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export interface Concept {
  text: string;
  name: string;
  role: string;
}

const scrollAnimate = { translateY: "-50%" };

// Berapa kali daftar kartu digandakan ke bawah. Harus GENAP agar loop -50%
// tetap mulus. Makin besar = makin banyak cadangan kartu di bawah, sehingga
// tidak pernah terlihat kosong walau kolomnya tinggi. (2 = minimum, 4 = aman)
const REPEAT_COUNT = 4;

export function TestimonialsColumn(props: {
  className?: string;
  testimonials: Concept[];
  // Kecepatan auto-scroll dalam PIKSEL per detik. Karena berbasis piksel
  // (bukan durasi tetap), kecepatan visual sama meski tinggi kartu berbeda.
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const speed = props.speed ?? 35;
  const [duration, setDuration] = useState(20);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      // translateY -50% memindahkan track sejauh separuh tingginya.
      // duration = jarak (px) / kecepatan (px/detik) -> kecepatan visual konsisten.
      const distance = el.scrollHeight / 2;
      if (distance > 0) setDuration(distance / speed);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [speed]);

  const transition = {
    duration,
    repeat: Number.POSITIVE_INFINITY,
    ease: "linear" as const,
    repeatType: "loop" as const,
  };

  return (
    <div className={`tcol ${props.className ?? ""}`}>
      <motion.div
        ref={trackRef}
        className="tcol__track"
        animate={scrollAnimate}
        transition={transition}
      >
        {Array.from({ length: REPEAT_COUNT }).map((_, dup) => (
          <React.Fragment key={dup}>
            {props.testimonials.map((item, i) => (
              <div className="tcol__card" key={`${dup}-${i}`}>
                <p className="tcol__text">{item.text}</p>
                <div className="tcol__meta">
                  <div className="tcol__name">{item.name}</div>
                  <div className="tcol__role">{item.role}</div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
}