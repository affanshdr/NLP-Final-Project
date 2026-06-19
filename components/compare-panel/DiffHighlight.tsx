import type { DiffToken } from "@/lib/types";

export default function DiffHighlight({ tokens }: { tokens: DiffToken[] }) {
  return (
    <p className="diff">
      {tokens.map((t, i) => {
        if (t.type === "equal") return <span key={i}>{t.value}</span>;
        if (t.type === "insert")
          return (
            <span key={i} className="diff-insert">
              {t.value}
            </span>
          );
        return (
          <span key={i} className="diff-delete">
            {t.value}
          </span>
        );
      })}
    </p>
  );
}
