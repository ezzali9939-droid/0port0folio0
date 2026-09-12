"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const links = [
  ["HOME", "/"],
  ["ABOUT", "/about"],
  ["WORK", "/work"],
  ["CONTACT", "/contact"],
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const [prevPathname, setPrevPathname] = useState(pathname);

  // Close mobile dropdown when route changes
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }


  // Click outside to close mobile dropdown panel
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [mobileMenuOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleMobileNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    // Smoothly close menu first, then navigate
    setTimeout(() => {
      router.push(href);
    }, 180);
  };

  return (
    <motion.header
      ref={headerRef}
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
              {label === "HOME" ? "Home" : label === "ABOUT" ? "About" : label === "WORK" ? "Work" : "Contact"}
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Soft transparent backdrop for click-outside closing */}
            <motion.div
              className="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Compact Floating Dropdown Panel */}
            <motion.div
              id="mobile-navigation"
              className="mobile-dropdown-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="mobile-dropdown-nav" aria-label="Mobile navigation links">
                {links.map(([label, href]) => {
                  const active = isActive(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`mobile-dropdown-link ${active ? "active-link" : ""}`}
                      aria-current={active ? "page" : undefined}
                      onClick={(e) => handleMobileNavClick(e, href)}
                    >
                      <span>{label}</span>
                      {active && <span className="mobile-active-dot" aria-hidden="true" />}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

