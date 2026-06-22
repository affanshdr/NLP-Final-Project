import { Code, Terminal, Braces } from "lucide-react";

// Logo GitHub dibuat manual karena lucide-react sudah menghapus ikon brand
const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.68.8.56C20.71 21.38 24 17.07 24 12 24 5.73 18.77.5 12.5.5H12z" />
  </svg>
);

const navLinks = [
  "サイトマップ",
  "プライバシーポリシー",
  "サイトご利用規約",
  "お問い合わせ",
  " 公式ショップ",
];

const techPills = [
  { Icon: GithubIcon, label: "GitHub" },
  { Icon: Code, label: "Next.js" },
  { Icon: Terminal, label: "FastAPI" },
  { Icon: Braces, label: "IndoT5" },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__divider" />
      <div className="site-footer__inner">
        <div className="site-footer__brand">Ejaku.id</div>

        <nav className="site-footer__links">
          {navLinks.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </nav>

        <div className="site-footer__pills">
          {techPills.map(({ Icon, label }) => (
            <span key={label} className="site-footer__pill">
              <Icon className="site-footer__icon" />
              <span>{label}</span>
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}