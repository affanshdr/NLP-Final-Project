export default function LoadingView({ progress }: { progress?: string }) {
  return (
    <div className="scan-loader">
      <p className="scan-loader__text">
        <span>Merapikan</span>
      </p>
      <span className="scan-loader__caption">{progress ?? "Memuat…"}</span>
    </div>
  );
}