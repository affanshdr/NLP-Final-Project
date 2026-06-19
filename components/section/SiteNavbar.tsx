"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface SiteNavbarProps {
  back?: boolean;
}

const navItems = [
  { name: "Beranda", link: "/" },
  { name: "Tentang", link: "/#tentang" },
  { name: "Tim", link: "/#tim" },
];

export default function SiteNavbar({ back = false }: SiteNavbarProps) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) {
        setHidden(false);
      } else if (y > lastY + 4) {
        // scroll turun -> sembunyikan
        setHidden(true);
        setOpen(false);
      } else if (y < lastY - 4) {
        // scroll naik -> tampilkan
        setHidden(false);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`site-nav${hidden ? " is-hidden" : ""}`}>
      <div className="site-nav__inner">
        <Link href="/" className="site-nav__logo" onClick={() => setOpen(false)}>
          Ejaku<span className="site-nav__logo-accent">.id</span>
        </Link>

        {/* Menu tengah (desktop) */}
        <div className="site-nav__links">
          {navItems.map((item) => (
            <Link key={item.link} href={item.link} className="site-nav__link">
              {item.name}
            </Link>
          ))}
        </div>

        {/* Aksi kanan (desktop) */}
        <div className="site-nav__right">
          {back && (
            <Link href="/" className="site-nav__back">
              ← Beranda
            </Link>
          )}
          <Link href="/koreksi" className="site-nav__cta">
            Coba Koreksi
          </Link>
        </div>

        {/* Tombol hamburger (mobile) */}
        <button
          type="button"
          className="site-nav__toggle"
          aria-label="Buka menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="site-nav__mobile">
          {navItems.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className="site-nav__mobile-link"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
          {back && (
            <Link
              href="/"
              className="site-nav__mobile-link"
              onClick={() => setOpen(false)}
            >
              ← Beranda
            </Link>
          )}
          <Link
            href="/koreksi"
            className="site-nav__cta site-nav__cta--mobile"
            onClick={() => setOpen(false)}
          >
            Coba Koreksi
          </Link>
        </div>
      )}
    </nav>
  );
}