"use client";

import type { DiffToken } from "@/lib/types";

interface Props {
  tokens: DiffToken[];
  groups: Array<number | null>;
  side: "original" | "corrected";
  focusGroup: number | null;
  onFocusGroup: (group: number | null) => void;
}

export default function DiffSide({ tokens, groups, side, focusGroup, onFocusGroup }: Props) {
  const isOriginal = side === "original";

  return (
    <p className="diff">
      {tokens.map((t, i) => {
        const group = groups[i];

        if (t.type === "equal") {
          return <span key={i} className="diff-token">{t.value}</span>;
        }

        const visible = isOriginal ? t.type === "delete" : t.type === "insert";
        if (!visible) return null;

        const base = t.type === "delete" ? "diff-delete" : "diff-insert";
        const focused = group !== null && group === focusGroup;
        const className = "diff-token " + base + (focused ? " is-focused" : "");

        return (
          <span
            key={i}
            className={className}
            onDoubleClick={(e) => {
              e.stopPropagation();
              onFocusGroup(focusGroup === group ? null : group);
            }}
          >
            {t.value}
          </span>
        );
      })}
    </p>
  );
}