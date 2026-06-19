export default function LoadingView({ progress }: { progress?: string }) {
  return (
    <div className="loading">
      <div className="spinner" />
      <p>{progress ?? "Memuat…"}</p>
    </div>
  );
}