import type { DiffToken } from "./types";

function tokenize(text: string): string[] {
  return text.match(/\s+|[^\s]+/g) ?? [];
}

function push(tokens: DiffToken[], type: DiffToken["type"], value: string) {
  const last = tokens[tokens.length - 1];
  if (last && last.type === type) {
    last.value += value;
  } else {
    tokens.push({ type, value });
  }
}

// Diff kata-per-kata berbasis LCS.
export function wordDiff(original: string, corrected: string): DiffToken[] {
  const a = tokenize(original);
  const b = tokenize(corrected);
  const n = a.length;
  const m = b.length;

  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  );
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] =
        a[i] === b[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }

  const tokens: DiffToken[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      push(tokens, "equal", a[i]);
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) {
      push(tokens, "delete", a[i]);
      i++;
    } else {
      push(tokens, "insert", b[j]);
      j++;
    }
  }
  while (i < n) push(tokens, "delete", a[i++]);
  while (j < m) push(tokens, "insert", b[j++]);

  return tokens;
}

export function hasChanges(tokens: DiffToken[]): boolean {
  return tokens.some((t) => t.type !== "equal" && t.value.trim().length > 0);
}
