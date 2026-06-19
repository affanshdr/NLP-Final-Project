import type { DiffToken } from "@/lib/types";

interface Props {
  tokens: DiffToken[];
  side: "original" | "corrected";
}

export default function DiffSide({ tokens, side }: Props) {
  const isOriginal = side === "original";

  return (
    <p className="diff">
      {tokens.map((t, i) => {
        // Bagian yang tidak berubah: muncul di kedua sisi tanpa warna.
        if (t.type === "equal") return <span key={i}>{t.value}</span>;

        if (isOriginal) {
          // Sisi kiri: hanya bagian asli yang dihapus/diganti (merah).
          return t.type === "delete" ? (
            <span key={i} className="diff-delete">
              {t.value}
            </span>
          ) : null;
        }

        // Sisi kanan: hanya hasil koreksi/penambahan (hijau).
        return t.type === "insert" ? (
          <span key={i} className="diff-insert">
            {t.value}
          </span>
        ) : null;
      })}
    </p>
  );
}