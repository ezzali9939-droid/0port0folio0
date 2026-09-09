"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const links = [
  ["Home", "/"],
  ["About", "/about"],
  ["Work", "/work"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <motion.header
      className="site-header shell"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0.2 : 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link className="brand" href="/" aria-label="Ezz Eldin home">
        <Image
          src="/assets/brand/logo/ez-wordmark-black.webp"
          alt="Ezz Eldin"
          width={96}
          height={30}
          priority
        />
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        {links.map(([label, href]) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={active ? "active-link" : ""}
              aria-current={active ? "page" : undefined}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="header-actions">
        <span className="availability">
          <i />
          Available
        </span>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span>{mobileMenuOpen ? "CLOSE" : "MENU"}</span>
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="mobile-menu-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <nav className="mobile-nav" aria-label="Mobile navigation links">
            {links.map(([label, href]) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`mobile-nav-link ${active ? "active-link" : ""}`}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>{label}</span>
                  {active && <span className="active-dot" aria-hidden="true" />}
                </Link>
              );
            })}
          </nav>
          <div className="mobile-menu-footer">
            <span className="availability">
              <i />
              Available for select projects
            </span>
          </div>
        </div>
      )}
    </motion.header>
  );
}
