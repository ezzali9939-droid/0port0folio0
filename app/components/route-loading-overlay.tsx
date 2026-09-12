"use client";

import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";

export function RouteLoadingOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearLoading = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTargetPath(null);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }
  }, []);

  // Clear loading state whenever navigation completes (pathname or searchParams update)
  useEffect(() => {
    clearLoading();
  }, [pathname, searchParams, clearLoading]);

  // Global window/lifecycle events that MUST clear loading state instantly
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("popstate", clearLoading);
    window.addEventListener("pageshow", clearLoading);
    window.addEventListener("focus", clearLoading);
    window.addEventListener("error", clearLoading);
    window.addEventListener("unhandledrejection", clearLoading);

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        clearLoading();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("popstate", clearLoading);
      window.removeEventListener("pageshow", clearLoading);
      window.removeEventListener("focus", clearLoading);
      window.removeEventListener("error", clearLoading);
      window.removeEventListener("unhandledrejection", clearLoading);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [clearLoading]);

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
        href.startsWith("javascript:") ||
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

        // Only trigger loading overlay if navigating to a DIFFERENT pathname or search
        if (
          url.origin === currentUrl.origin &&
          (url.pathname !== currentUrl.pathname || url.search !== currentUrl.search)
        ) {
          setTargetPath(url.pathname + url.search);

          // Fail-safe: Automatically dismiss overlay after 1000ms if navigation stalls
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          timeoutRef.current = setTimeout(() => {
            clearLoading();
          }, 1000);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
    };
  }, [clearLoading]);

  const currentFull = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
  const isLoading =
    targetPath !== null &&
    targetPath !== currentFull &&
    targetPath !== pathname;

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


