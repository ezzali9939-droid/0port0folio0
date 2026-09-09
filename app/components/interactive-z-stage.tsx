"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function InteractiveZStage() {
  const zWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isTouch) return;

    const parentSection = zWrapperRef.current?.closest(".journey-section") as HTMLElement | null;
    const innerEl = zWrapperRef.current?.querySelector<HTMLElement>(".z-motion-inner");
    if (!parentSection || !innerEl) return;

    let animFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parentSection.getBoundingClientRect();
      targetX = (e.clientX - rect.left) / rect.width - 0.5;
      targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    parentSection.addEventListener("mousemove", handleMouseMove);
    parentSection.addEventListener("mouseleave", handleMouseLeave);

    const render = (time: number) => {
      // Lerp factor around 0.08
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const elapsedTime = (time - startTime) * 0.001;

      // Cursor motion
      const moveX = currentX * 18; // Max 18px horizontal
      const moveY = currentY * 12; // Max 12px vertical
      const rotY = currentX * 2.5; // Max 2.5deg rotateY
      const rotX = -currentY * 1.8; // Max 1.8deg rotateX
      const scale = 1 + Math.abs(currentX) * 0.008; // Max 1.01 scale

      // Subtle 3-4px idle vertical float
      const idleY = Math.sin(elapsedTime * 1.2) * 3.5;
      const finalY = moveY + idleY;

      innerEl.style.transform = `perspective(1000px) translate3d(${moveX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      parentSection.removeEventListener("mousemove", handleMouseMove);
      parentSection.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={zWrapperRef} className="z-center-wrapper">
      <div className="z-motion-inner">
        <Image
          src="/assets/page-assets/home/journey-z-architecture.webp"
          alt="A metallic Z architecture representing the design journey"
          width={860}
          height={620}
          sizes="(max-width: 760px) 100vw, 43vw"
          priority
          className="z-image"
        />
      </div>

      <div className="journey-ez-logo" aria-hidden="true">
        <Image
          src="/assets/brand/logo/ez-symbol-black.webp"
          alt="Official EZ Logo Symbol"
          width={84}
          height={84}
          priority
        />
      </div>
    </div>
  );
}
