"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { setInputText, setInputFile } from "@/lib/session";
import { CHUNK_LIMITS } from "@/lib/chunk";

const cardInitial = { y: 24, opacity: 0 };
const cardAnimate = { y: 0, opacity: 1 };
const cardTransition = {
  delay: 0.9,
  type: "spring" as const,
  stiffness: 120,
  damping: 16,
};

function ArrowUpIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

function SquareIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect width="14" height="14" x="5" y="5" rx="2" />
    </svg>
  );
}

export default function InputSection() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const disabled = busy || text.trim().length === 0;

  function handleSubmit() {
    if (disabled) return;
    setBusy(true);
    setInputFile(null, null); // pastikan tidak ada file lama yang terbawa
    setInputText(text.trim());
    router.push("/koreksi");
  }

  return (
    <motion.section
      id="input"
      className="section input-section"
      initial={cardInitial}
      animate={cardAnimate}
      transition={cardTransition}
    >
      <div className="container">
        <div className="prompt-input">
          <textarea
            className="prompt-input__textarea"
            placeholder="Tempel atau ketik teks di sini…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            maxLength={CHUNK_LIMITS.MAX_CHARS}
            disabled={busy}
          />
          <div className="prompt-input__footer">
            <span className="prompt-input__meta">
              {wordCount} kata · {charCount}/{CHUNK_LIMITS.MAX_CHARS} karakter
            </span>
            <button
              type="button"
              className="prompt-input__send"
              onClick={handleSubmit}
              disabled={disabled}
              aria-label={busy ? "Memproses" : "Periksa teks"}
            >
              {busy ? <SquareIcon /> : <ArrowUpIcon />}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}