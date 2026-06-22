"use client";

import React, { useRef } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

export function ContainerScroll({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Haluskan dulu progress scroll-nya (kunci anti "lompat-lompat" saat
  // dipakai bareng Lenis).
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
    restDelta: 0.001,
  });

  // Membesar lebih cepat per scroll, tapi MULUS -> pakai smoothProgress.
  const scale = useTransform(smoothProgress, [0, 0.52], [0.55, 0.9]);

  const cardStyle = {
    scale,
    // Smooth layered shadow (gaya shadows.brumm.af): banyak lapisan dengan
    // opacity bertingkat -> memudar halus, tidak "memetak". Jangkauannya juga
    // lebih pendek (~88px) supaya gampang memudar sebelum Tim Section.
    boxShadow:
      "0 1px 1.4px rgba(0,0,0,0.02), 0 2.3px 3.5px rgba(0,0,0,0.028), 0 4.4px 6.6px rgba(0,0,0,0.035), 0 7.8px 11.8px rgba(0,0,0,0.042), 0 14.6px 22px rgba(0,0,0,0.05), 0 35px 53px rgba(0,0,0,0.07)",
  };

  return (
    <div className="cscroll" ref={containerRef}>
      <div className="cscroll__sticky">
        <motion.div className="cscroll__card" style={cardStyle}>
          <div className="cscroll__card-inner">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}