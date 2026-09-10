"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

interface ToolItem {
  id: string;
  name: string;
  badgeType: "ps" | "ai" | "id" | "figma" | "webflow" | "github" | "vercel" | "aitools";
  left: string;
  top: string;
}

// 8 Tools arranged along an enlarged 16% wider orbit outside the ring
const TOOLS_LIST: ToolItem[] = [
  { id: "ps", name: "PHOTOSHOP", badgeType: "ps", left: "47%", top: "10%" },
  { id: "ai", name: "ILLUSTRATOR", badgeType: "ai", left: "78%", top: "16%" },
  { id: "id", name: "INDESIGN", badgeType: "id", left: "87%", top: "45%" },
  { id: "figma", name: "FIGMA", badgeType: "figma", left: "82%", top: "73%" },
  { id: "webflow", name: "WEBFLOW", badgeType: "webflow", left: "43%", top: "84%" },
  { id: "github", name: "GITHUB", badgeType: "github", left: "20%", top: "76%" },
  { id: "vercel", name: "VERCEL", badgeType: "vercel", left: "8%", top: "48%" },
  { id: "aitools", name: "AI TOOLS", badgeType: "aitools", left: "12%", top: "20%" },
];

interface ToolMark {
  id: number;
  type: "dot" | "star" | "ring" | "plus" | "square" | "corner" | "signal";
  left: string;
  top: string;
  depth: 1 | 2 | 3;
}

const FIXED_TOOL_MARKS: ToolMark[] = [
  { id: 1, type: "corner", left: "4%", top: "10%", depth: 1 },
  { id: 2, type: "dot", left: "28%", top: "8%", depth: 2 },
  { id: 3, type: "plus", left: "92%", top: "12%", depth: 1 },
  { id: 4, type: "ring", left: "96%", top: "34%", depth: 3 },
  { id: 5, type: "star", left: "92%", top: "80%", depth: 2 },
  { id: 6, type: "square", left: "68%", top: "90%", depth: 1 },
  { id: 7, type: "dot", left: "32%", top: "92%", depth: 2 },
  { id: 8, type: "signal", left: "69%", top: "94%", depth: 1 },
  { id: 9, type: "plus", left: "5%", top: "88%", depth: 3 },
  { id: 10, type: "corner", left: "96%", top: "92%", depth: 1 },
  { id: 11, type: "ring", left: "5%", top: "62%", depth: 2 },
  { id: 12, type: "square", left: "36%", top: "14%", depth: 3 },
  { id: 13, type: "dot", left: "82%", top: "8%", depth: 1 },
];

export function InteractiveToolsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const toolNodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const parentSection = containerRef.current?.closest(".tools-section-redesign") as HTMLElement | null;
    const ringEl = ringRef.current;
    const markEls = containerRef.current?.querySelectorAll<HTMLElement>(".tool-mark-item");

    if (!parentSection || !ringEl) return;

    let isIntersecting = true;

    // IntersectionObserver to pause animation when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
          if (ringEl) {
            ringEl.style.animationPlayState = entry.isIntersecting && !reduceMotion ? "running" : "paused";
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(parentSection);

    let animFrameId: number;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parentSection.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / rect.width - 0.5;
      targetMouseY = (e.clientY - rect.top) / rect.height - 0.5;
    };

    const handleMouseLeave = () => {
      targetMouseX = 0;
      targetMouseY = 0;
    };

    if (!isTouch && !reduceMotion) {
      parentSection.addEventListener("mousemove", handleMouseMove, { passive: true });
      parentSection.addEventListener("mouseleave", handleMouseLeave, { passive: true });
    }

    // Animation variables for continuous orbital movement
    let startTime: number | null = null;
    const REVOLUTION_MS = 40000; // ~40s per revolution
    const BASE_START_ANGLE = -1.6755; // -96deg in rad (Photoshop starting at top-center)
    const CX = 53.333; // SVG Ellipse center X %
    const CY = 50.0;   // SVG Ellipse center Y %
    const RX_BASE = 44.167; // SVG Outer ellipse rx % (530/1200)
    const RY_BASE = 37.857; // SVG Outer ellipse ry % (265/700)

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;

      // Lerp mouse parallax for background technical marks ONLY
      currentMouseX += (targetMouseX - currentMouseX) * 0.08;
      currentMouseY += (targetMouseY - currentMouseY) * 0.08;

      if (markEls && !isTouch && !reduceMotion) {
        markEls.forEach((el) => {
          const depth = Number(el.dataset.depth || 1);
          const mult = depth === 3 ? 18 : depth === 2 ? 12 : 7;
          const mx = currentMouseX * mult;
          const my = currentMouseY * mult;
          el.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
        });
      }

      // Orbital Animation for the 8 Tool Label groups along the elliptical guide
      if (!reduceMotion && isIntersecting && containerRef.current) {
        const elapsed = timestamp - startTime;
        const rotation = ((elapsed % REVOLUTION_MS) / REVOLUTION_MS) * 2 * Math.PI;

        const containerWidth = containerRef.current.clientWidth;
        let cx = CX;
        let cy = CY;
        let rx = RX_BASE;
        let ry = RY_BASE;

        if (containerWidth < 900) {
          cx = 50.0;
          cy = 50.0;
          rx = containerWidth < 480 ? 35.0 : 38.0;
          ry = containerWidth < 480 ? 34.0 : 36.0;
        } else {
          let scale = 1;
          if (containerWidth < 1024) scale = 0.90;
          rx = RX_BASE * scale;
          ry = RY_BASE * scale;
        }

        const numTools = TOOLS_LIST.length;
        toolNodeRefs.current.forEach((el, i) => {
          if (!el) return;
          const phaseOffset = (i / numTools) * 2 * Math.PI;
          const angle = BASE_START_ANGLE + phaseOffset + rotation;

          const x = cx + rx * Math.cos(angle);
          const y = cy + ry * Math.sin(angle);

          el.style.left = `${x.toFixed(3)}%`;
          el.style.top = `${y.toFixed(3)}%`;
        });
      }

      animFrameId = requestAnimationFrame(render);
    };

    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      observer.disconnect();
      if (!isTouch && !reduceMotion) {
        parentSection.removeEventListener("mousemove", handleMouseMove);
        parentSection.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="tools-interactive-container">
      {/* SVG Orbit Lines & Technical Guide Overlay */}
      <svg className="tools-orbit-svg" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <ellipse cx="500" cy="300" rx="360" ry="200" stroke="var(--ink)" strokeOpacity="0.09" strokeWidth="1" fill="none" strokeDasharray="4 4" />
        <ellipse cx="500" cy="300" rx="280" ry="150" stroke="var(--ink)" strokeOpacity="0.06" strokeWidth="1" fill="none" />
        <line x1="100" y1="300" x2="900" y2="300" stroke="var(--ink)" strokeOpacity="0.04" strokeWidth="1" />
      </svg>

      {/* Decorative Technical Marks Layer (13 elements) */}
      <div className="tools-marks-layer" aria-hidden="true">
        {FIXED_TOOL_MARKS.map((mark) => (
          <div
            key={mark.id}
            className={`tool-mark-item mark-tools-${mark.type}`}
            data-depth={mark.depth}
            style={{ left: mark.left, top: mark.top }}
          >
            {mark.type === "plus" && "+"}
            {mark.type === "star" && "✦"}
            {mark.type === "signal" && <span className="tools-signal-dot" />}
            {mark.type === "corner" && <span className="tools-corner-icon" />}
            {mark.type === "ring" && <span className="tools-ring-icon" />}
            {mark.type === "square" && <span className="tools-square-icon" />}
            {mark.type === "dot" && <span className="tools-dot-icon" />}
          </div>
        ))}
      </div>

      {/* Central Metallic Ring Stage (Automatic 3D Orbit Motion) */}
      <div ref={ringRef} className="tools-ring-stage auto-3d-orbit">
        <Image
          src="/assets/page-assets/home/ChatGPT Image Sep 9, 2026, 10_21_23 PM.png"
          alt="Black metallic orbit ring representing tool mastery"
          width={920}
          height={620}
          sizes="(max-width: 760px) 85vw, 52vw"
          priority
          className="tools-ring-image"
        />
      </div>

      {/* 8 Orbital Tool Badges System (Positioned OUTSIDE the Ring) */}
      <div className="tools-orbit-system" aria-label="Tools Inventory">
        {TOOLS_LIST.map((tool, idx) => (
          <div
            key={tool.id}
            ref={(el) => {
              toolNodeRefs.current[idx] = el;
            }}
            className={`tool-node-item node-${tool.id}`}
            style={{ left: tool.left, top: tool.top }}
          >
            <div className={`tool-badge badge-${tool.badgeType}`}>
              {tool.badgeType === "ps" && <span>Ps</span>}
              {tool.badgeType === "ai" && <span>Ai</span>}
              {tool.badgeType === "id" && <span>Id</span>}
              {tool.badgeType === "figma" && (
                <svg width="12" height="18" viewBox="0 0 38 57" fill="currentColor">
                  <path fill="#fff" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0zM0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0zM0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5zM0 9.5A9.5 9.5 0 0 1 9.5 0H19v19H9.5A9.5 9.5 0 0 1 0 9.5zM19 0h9.5a9.5 9.5 0 1 1 0 19H19V0z" />
                </svg>
              )}
              {tool.badgeType === "webflow" && <span className="webflow-w">W</span>}
              {tool.badgeType === "github" && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path fill="#fff" d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
                </svg>
              )}
              {tool.badgeType === "vercel" && <span className="vercel-tri">▲</span>}
              {tool.badgeType === "aitools" && <span className="ai-tri">▲</span>}
            </div>

            <div className="tool-info">
              <span className="tool-label">{tool.name}</span>
            </div>

            <span className="tool-guide-square" aria-hidden="true" />
          </div>
        ))}
      </div>
    </div>
  );
}

