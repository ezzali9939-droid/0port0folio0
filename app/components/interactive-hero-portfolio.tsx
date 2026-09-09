"use client";

import { useEffect, useRef } from "react";

interface HeroMark {
  id: number;
  type: "dot" | "star" | "ring" | "plus" | "square" | "corner" | "line" | "signal";
  left: string;
  top: string;
  depth: 1 | 2 | 3;
  connect?: boolean;
}

const FIXED_HERO_MARKS: HeroMark[] = [
  { id: 1, type: "corner", left: "5%", top: "14%", depth: 1 },
  { id: 2, type: "dot", left: "14%", top: "28%", depth: 2, connect: true },
  { id: 3, type: "plus", left: "24%", top: "18%", depth: 1 },
  { id: 5, type: "star", left: "88%", top: "16%", depth: 2, connect: true },
  { id: 6, type: "signal", left: "92%", top: "28%", depth: 1 },
  { id: 7, type: "square", left: "82%", top: "70%", depth: 3 },
  { id: 8, type: "line", left: "74%", top: "12%", depth: 1 },
  { id: 9, type: "plus", left: "94%", top: "64%", depth: 2 },
  { id: 11, type: "corner", left: "90%", top: "82%", depth: 1 },
];

const PORTFOLIO_LETTERS = ["P", "O", "R", "T", "F", "O", "L", "I", "O"];

export function InteractiveHeroPortfolio() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || isTouch) return;

    const parentHero = containerRef.current?.closest(".hero-home") as HTMLElement | null;
    const wordInner = containerRef.current?.querySelector<HTMLElement>(".portfolio-motion-text");
    const letterEls = containerRef.current?.querySelectorAll<HTMLElement>(".hero-letter");
    const markEls = containerRef.current?.querySelectorAll<HTMLElement>(".hero-mark-item");
    const connectLines = svgRef.current?.querySelectorAll<SVGLineElement>(".connect-line");

    if (!parentHero || !wordInner) return;

    let animFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let cursorPxX = 0;
    let cursorPxY = 0;
    const startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parentHero.getBoundingClientRect();
      cursorPxX = e.clientX - rect.left;
      cursorPxY = e.clientY - rect.top;

      targetX = cursorPxX / rect.width - 0.5;
      targetY = cursorPxY / rect.height - 0.5;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    parentHero.addEventListener("mousemove", handleMouseMove);
    parentHero.addEventListener("mouseleave", handleMouseLeave);

    const render = (time: number) => {
      // Lerp physics (0.08 factor)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      const elapsedTime = (time - startTime) * 0.001;

      // Word main magnetic motion (Max 16px horizontal, 12px vertical, 0.4deg rotate, 0.6deg skew)
      const moveX = currentX * 16;
      const moveY = currentY * 12;
      const rot = currentX * 0.4;
      const skew = currentY * 0.6;
      const extraSpacing = Math.abs(currentX) * 0.003; // subtle letter-spacing shift

      wordInner.style.transform = `translate3d(${moveX.toFixed(2)}px, ${moveY.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) skewX(${skew.toFixed(2)}deg)`;
      wordInner.style.letterSpacing = `${(-0.05 + extraSpacing).toFixed(4)}em`;

      // Typographic letter wave delay (max 4-6px)
      if (letterEls) {
        letterEls.forEach((el, idx) => {
          const delayOffset = Math.sin(elapsedTime * 2.2 + idx * 0.45) * 2.5;
          const mouseOffset = currentY * (3.5 + idx * 0.3);
          const totalY = delayOffset + mouseOffset;
          el.style.transform = `translate3d(0, ${totalY.toFixed(2)}px, 0)`;
        });
      }

      // Technical background marks (depth speeds: 1 -> 8px, 2 -> 15px, 3 -> 24px)
      if (markEls) {
        markEls.forEach((el) => {
          const depth = Number(el.dataset.depth || 1);
          const mult = depth === 3 ? 24 : depth === 2 ? 15 : 8;
          const mx = currentX * mult;
          const my = currentY * mult;
          el.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
        });
      }

      // Proximity connection 1px lines
      if (connectLines && svgRef.current && parentHero) {
        const connectMarks = parentHero.querySelectorAll<HTMLElement>("[data-connect='true']");
        const heroRect = parentHero.getBoundingClientRect();

        connectLines.forEach((line, index) => {
          const markEl = connectMarks[index];
          if (!markEl) return;

          const markRect = markEl.getBoundingClientRect();
          const markCenterX = markRect.left - heroRect.left + markRect.width / 2;
          const markCenterY = markRect.top - heroRect.top + markRect.height / 2;

          const dx = cursorPxX - markCenterX;
          const dy = cursorPxY - markCenterY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 220 && Math.abs(currentX) > 0.01) {
            const alpha = Math.max(0, (1 - dist / 220) * 0.28);
            line.setAttribute("x1", cursorPxX.toFixed(1));
            line.setAttribute("y1", cursorPxY.toFixed(1));
            line.setAttribute("x2", markCenterX.toFixed(1));
            line.setAttribute("y2", markCenterY.toFixed(1));
            line.setAttribute("stroke-opacity", alpha.toFixed(3));
          } else {
            line.setAttribute("stroke-opacity", "0");
          }
        });
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      parentHero.removeEventListener("mousemove", handleMouseMove);
      parentHero.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-interactive-layer">
      {/* 1px Connection Lines SVG */}
      <svg ref={svgRef} className="hero-connection-svg" aria-hidden="true">
        <line className="connect-line" stroke="var(--ink)" strokeWidth="1" strokeOpacity="0" />
        <line className="connect-line" stroke="var(--ink)" strokeWidth="1" strokeOpacity="0" />
        <line className="connect-line" stroke="var(--ink)" strokeWidth="1" strokeOpacity="0" />
      </svg>

      {/* Technical Marks (12 elements) */}
      <div className="hero-marks-layer" aria-hidden="true">
        {FIXED_HERO_MARKS.map((mark) => (
          <div
            key={mark.id}
            className={`hero-mark-item mark-hero-${mark.type}`}
            data-depth={mark.depth}
            data-connect={mark.connect ? "true" : undefined}
            style={{ left: mark.left, top: mark.top }}
          >
            {mark.type === "plus" && "+"}
            {mark.type === "star" && "✦"}
            {mark.type === "signal" && <span className="blue-signal-dot" />}
            {mark.type === "corner" && <span className="hero-corner-icon" />}
            {mark.type === "ring" && <span className="hero-ring-icon" />}
            {mark.type === "square" && <span className="hero-square-icon" />}
            {mark.type === "line" && <span className="hero-line-icon" />}
            {mark.type === "dot" && <span className="hero-dot-icon" />}
          </div>
        ))}
      </div>

      {/* Stationary Centered PORTFOLIO Typography Outer Wrapper (z-index: 2) */}
      <div className="portfolio-center">
        <div className="portfolio-motion-text" role="img" aria-label="PORTFOLIO">
          {PORTFOLIO_LETTERS.map((char, index) => (
            <span key={index} className="hero-letter" aria-hidden="true">
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
