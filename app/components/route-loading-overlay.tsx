"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function RouteLoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [targetPath, setTargetPath] = useState<string | null>(null);

  // Clear targetPath whenever navigation completes (pathname or searchParams update)
  useEffect(() => {
    setTargetPath(null);
  }, [pathname, searchParams]);

  // Handle browser Back/Forward (popstate), page restoration (pageshow), and visibility
  useEffect(() => {
    if (typeof window === "undefined") return;

    const clearLoading = () => {
      setTargetPath(null);
    };

    window.addEventListener("popstate", clearLoading);
    window.addEventListener("pageshow", clearLoading);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        clearLoading();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("popstate", clearLoading);
      window.removeEventListener("pageshow", clearLoading);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Intercept client link clicks for pending loading state
  useEffect(() => {
    if (typeof window === "undefined") return;

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
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        const currentUrl = new URL(window.location.href);
        if (
          url.origin === currentUrl.origin &&
          (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)
        ) {
          setTargetPath(url.pathname + url.search);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, []);

  const currentFull = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
  const isLoading = targetPath !== null && targetPath !== currentFull && targetPath !== pathname;

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

