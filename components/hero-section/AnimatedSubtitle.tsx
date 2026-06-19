"use client";

import { motion } from "framer-motion";

const wordStyle = { display: "inline-block", marginRight: "0.28em" };

export default function AnimatedSubtitle({
  text,
  startDelay = 0.6,
}: {
  text: string;
  startDelay?: number;
}) {
  const words = text.split(" ");

  return (
    <p className="hero-sub">
      {words.map((word, i) => {
        const initial = { y: 24, opacity: 0 };
        const animate = { y: 0, opacity: 1 };
        const transition = {
          delay: startDelay + i * 0.04,
          type: "spring" as const,
          stiffness: 120,
          damping: 16,
        };
        return (
          <motion.span
            className="hero-sub__word"
            style={wordStyle}
            key={i}
            initial={initial}
            animate={animate}
            transition={transition}
          >
            {word}
          </motion.span>
        );
      })}
    </p>
  );
}