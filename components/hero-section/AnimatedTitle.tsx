"use client";

import { motion } from "framer-motion";

const wordStyle = { display: "inline-block", marginRight: "0.25em" };
const letterStyle = { display: "inline-block" };

export default function AnimatedTitle({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <h1 className="hero-title">
      {words.map((word, wordIndex) => (
        <span className="hero-title__word" style={wordStyle} key={wordIndex}>
          {word.split("").map((letter, letterIndex) => {
            const initial = { y: 90, opacity: 0 };
            const animate = { y: 0, opacity: 1 };
            const transition = {
              delay: wordIndex * 0.1 + letterIndex * 0.04,
              type: "spring" as const,
              stiffness: 120,
              damping: 12,
            };
            return (
              <motion.span
                className="hero-title__letter"
                style={letterStyle}
                key={`${wordIndex}-${letterIndex}`}
                initial={initial}
                animate={animate}
                transition={transition}
              >
                <span className="hero-title__inner">{letter}</span>
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}