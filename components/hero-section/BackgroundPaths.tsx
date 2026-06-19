"use client";

import { motion } from "framer-motion";

const pathInitial = { pathLength: 0.3, opacity: 0.6 };

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.02,
  }));

  return (
    <svg
      className="bg-paths__svg"
      viewBox="0 0 696 316"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {paths.map((path) => {
        const animate = {
          pathLength: 1,
          opacity: [0.3, 0.6, 0.3],
          pathOffset: [0, 1, 0],
        };
        const transition = {
          duration: 20 + Math.random() * 10,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear" as const,
        };
        return (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.06 + path.id * 0.014}
            initial={pathInitial}
            animate={animate}
            transition={transition}
          />
        );
      })}
    </svg>
  );
}

export default function BackgroundPaths() {
  return (
    <div className="bg-paths" aria-hidden="true">
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
    </div>
  );
}