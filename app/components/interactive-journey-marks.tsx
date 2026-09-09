"use client";

import { useEffect, useRef } from "react";

interface Mark {
  id: number;
  type: "dot" | "ring" | "square" | "plus" | "crosshair" | "line" | "corner";
  left: string;
  top: string;
  size: number;
  opacity: number;
  depthGroup: 1 | 2 | 3;
}

// 22 Predefined fixed marks with deterministic coordinates (No Math.random during SSR)
const FIXED_MARKS: Mark[] = [
  // Top Left / Header Area
  { id: 1, type: "corner", left: "4%", top: "8%", size: 14, opacity: 0.35, depthGroup: 1 },
  { id: 2, type: "dot", left: "14%", top: "12%", size: 4, opacity: 0.3, depthGroup: 2 },
  { id: 3, type: "plus", left: "22%", top: "7%", size: 10, opacity: 0.25, depthGroup: 1 },
  { id: 4, type: "ring", left: "8%", top: "20%", size: 12, opacity: 0.3, depthGroup: 3 },

  // Top Right / Indicator Area
  { id: 5, type: "line", left: "78%", top: "9%", size: 24, opacity: 0.25, depthGroup: 1 },
  { id: 6, type: "crosshair", left: "88%", top: "14%", size: 14, opacity: 0.35, depthGroup: 2 },
  { id: 7, type: "square", left: "94%", top: "8%", size: 6, opacity: 0.3, depthGroup: 3 },
  { id: 8, type: "dot", left: "84%", top: "22%", size: 5, opacity: 0.4, depthGroup: 1 },

  // Middle Left Area (Beside Timeline)
  { id: 9, type: "plus", left: "3%", top: "42%", size: 12, opacity: 0.3, depthGroup: 2 },
  { id: 10, type: "ring", left: "18%", top: "34%", size: 14, opacity: 0.2, depthGroup: 3 },
  { id: 11, type: "line", left: "6%", top: "64%", size: 20, opacity: 0.25, depthGroup: 1 },
  { id: 12, type: "square", left: "16%", top: "76%", size: 8, opacity: 0.3, depthGroup: 2 },

  // Middle Right Area (Beside EZ Logo)
  { id: 13, type: "crosshair", left: "92%", top: "40%", size: 16, opacity: 0.35, depthGroup: 3 },
  { id: 14, type: "corner", left: "95%", top: "58%", size: 14, opacity: 0.3, depthGroup: 1 },
  { id: 15, type: "dot", left: "82%", top: "68%", size: 4, opacity: 0.35, depthGroup: 2 },
  { id: 16, type: "plus", left: "90%", top: "75%", size: 10, opacity: 0.25, depthGroup: 1 },

  // Bottom Area (Flanking Statement)
  { id: 17, type: "line", left: "12%", top: "88%", size: 28, opacity: 0.25, depthGroup: 2 },
  { id: 18, type: "ring", left: "24%", top: "92%", size: 16, opacity: 0.3, depthGroup: 3 },
  { id: 19, type: "dot", left: "32%", top: "86%", size: 5, opacity: 0.35, depthGroup: 1 },
  { id: 20, type: "square", left: "68%", top: "88%", size: 7, opacity: 0.3, depthGroup: 2 },
  { id: 21, type: "corner", left: "78%", top: "93%", size: 12, opacity: 0.35, depthGroup: 3 },
  { id: 22, type: "crosshair", left: "86%", top: "87%", size: 14, opacity: 0.25, depthGroup: 1 },
];

export function InteractiveJourneyMarks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check reduced motion or coarse touch pointer
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isTouch) return;

    const parentSection = containerRef.current?.closest(".journey-section") as HTMLElement | null;
    if (!parentSection) return;

    const items = containerRef.current?.querySelectorAll<HTMLElement>(".journey-mark-item");
    if (!items || items.length === 0) return;

    let animFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parentSection.getBoundingClientRect();
      // Normalized mouse coordinates from -1 to 1
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
      // Lerp / smooth interpolation
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const elapsedTime = (time - startTime) * 0.001;

      items.forEach((el, index) => {
        const depthGroup = Number(el.dataset.depth || 1);
        const speedMultiplier = depthGroup === 3 ? 32 : depthGroup === 2 ? 20 : 10;

        // Mouse offset
        const moveX = currentX * speedMultiplier;
        const moveY = currentY * speedMultiplier;

        // Subtle slow idle float drift
        const idleX = Math.sin(elapsedTime * 0.8 + index) * 2.5;
        const idleY = Math.cos(elapsedTime * 0.7 + index) * 2.5;

        const totalX = moveX + idleX;
        const totalY = moveY + idleY;

        el.style.transform = `translate3d(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0)`;
      });

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
    <div ref={containerRef} className="interactive-marks-layer" aria-hidden="true">
      {FIXED_MARKS.map((mark) => (
        <div
          key={mark.id}
          className={`journey-mark-item mark-type-${mark.type}`}
          data-depth={mark.depthGroup}
          style={{
            left: mark.left,
            top: mark.top,
            opacity: mark.opacity,
            width: mark.type === "plus" || mark.type === "corner" || mark.type === "crosshair" ? undefined : `${mark.size}px`,
            height: mark.type === "plus" || mark.type === "corner" || mark.type === "crosshair" ? undefined : `${mark.size}px`,
          }}
        >
          {mark.type === "plus" && "+"}
          {mark.type === "corner" && <span className="corner-icon" />}
          {mark.type === "crosshair" && <span className="crosshair-icon" />}
        </div>
      ))}
    </div>
  );
}
