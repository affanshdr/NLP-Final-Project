export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>
          Proyek Akhir Pemrosesan Bahasa Alami — SINF6054 Kelas A, Kelompok 2
        </p>
        <p className="footer-sub">
          Sistem Koreksi Ejaan &amp; Tata Bahasa Indonesia (mT5) ·{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
