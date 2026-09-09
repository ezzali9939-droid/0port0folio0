"use client";

import gsap from "gsap";
import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

export function AssetStage({ children, className = "", strength = 6 }: { children: ReactNode; className?: string; strength?: number }) {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = stage.current;
    return () => {
      if (el) gsap.killTweensOf(el);
    };
  }, []);
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !stage.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    gsap.to(stage.current, { x: ((event.clientX - rect.left) / rect.width - 0.5) * strength, y: ((event.clientY - rect.top) / rect.height - 0.5) * strength, duration: 0.6, ease: "power3.out" });
  };
  const reset = () => gsap.to(stage.current, { x: 0, y: 0, duration: 0.8, ease: "power3.out" });
  return <div ref={stage} className={className} onPointerMove={move} onPointerLeave={reset}>{children}</div>;
}
