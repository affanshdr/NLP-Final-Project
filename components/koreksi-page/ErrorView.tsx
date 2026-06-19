"use client";

import { useRouter } from "next/navigation";

export default function ErrorView({ message }: { message: string }) {
  const router = useRouter();
  return (
    <div className="error-box">
      <p>⚠️ {message}</p>
      <button className="btn btn-primary" onClick={() => router.push("/")}>
        Coba lagi
      </button>
    </div>
  );
}