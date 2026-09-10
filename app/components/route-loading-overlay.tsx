"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function RouteLoadingOverlay() {
  const pathname = usePathname();
  const [targetPath, setTargetPath] = useState<string | null>(null);

  // Derived loading state: active only when navigating to a new pathname
  const isLoading = targetPath !== null && targetPath !== pathname;

  useEffect(() => {
    if (typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
          setTargetPath(url.pathname);
          // Fail-safe: automatically dismiss after 3.5 seconds if navigation stalls or fails
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setTargetPath(null);
          }, 3500);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      clearTimeout(timeoutId);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div
      className="ez-loading-overlay"
      role="status"
      aria-label="Loading page transition"
      aria-live="polite"
    >
      <div className="ez-loading-logo-wrapper">
        <Image
          src="/assets/brand/logo/ez-wordmark-black.webp"
          alt="Ezz Eldin Logo Loading Indicator"
          width={240}
          height={72}
          priority
          style={{ width: "100%", height: "auto", objectFit: "contain" }}
          className="ez-loading-logo"
        />
      </div>
    </div>
  );
}
