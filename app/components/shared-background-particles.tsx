"use client";

import { useEffect, useRef } from "react";

interface ParticleMark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "dot" | "plus" | "ring";
  size: number;
  rotation: number;
  vRot: number;
  baseOpacity: number;
  phase: number;
  phaseSpeed: number;
  depth: number;
}

export function SharedBackgroundParticles({ className = "" }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let particles: ParticleMark[] = [];

    // Mouse tracking for parallax interaction
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let hasMouseMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      // Calculate normalized mouse position from center (-0.5 to 0.5)
      targetMouseX = (e.clientX - rect.left) / rect.width - 0.5;
      targetMouseY = (e.clientY - rect.top) / rect.height - 0.5;
      hasMouseMoved = true;
    };

    if (!isTouch && !reduceMotion) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
    }

    const createMark = (randomY = true): ParticleMark => {
      const types: ("dot" | "plus" | "ring")[] = ["dot", "dot", "plus", "plus", "ring"];
      const type = types[Math.floor(Math.random() * types.length)];
      const depth = Math.random() * 0.7 + 0.3; // Depth factor for parallax layering (0.3 to 1.0)
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : height + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.3 + 0.15), // Slow upward drift
        type,
        size: type === "ring" ? Math.random() * 3 + 3.5 : type === "plus" ? Math.random() * 3 + 3.5 : Math.random() * 1.5 + 1.2,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.008,
        baseOpacity: Math.random() * 0.07 + 0.08, // 8% - 15% opacity
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.015 + 0.008,
        depth,
      };
    };

    const initParticles = () => {
      particles = [];
      const isMobile = width <= 768;
      const divisor = isMobile ? 85000 : 45000;
      const baseCount = Math.floor((width * height) / divisor);
      const count = isMobile ? Math.max(10, Math.min(baseCount, 25)) : Math.max(18, Math.min(baseCount, 85));

      for (let i = 0; i < count; i++) {
        particles.push(createMark(true));
      }
    };

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
      initParticles();
    };

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    let isIntersecting = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isIntersecting = entry.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    const render = () => {
      if (isIntersecting && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        // Smoothly lerp mouse movement
        if (hasMouseMoved) {
          currentMouseX += (targetMouseX - currentMouseX) * 0.05;
          currentMouseY += (targetMouseY - currentMouseY) * 0.05;
        }

        const parallaxMaxX = 24; // Max 24px horizontal shift
        const parallaxMaxY = 24; // Max 24px vertical shift

        particles.forEach((p, idx) => {
          if (!reduceMotion) {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.vRot;
            p.phase += p.phaseSpeed;
          }

          // Sinusoidal opacity fade-in / fade-out cycle
          const currentOpacity = p.baseOpacity * (0.65 + 0.35 * Math.sin(p.phase));

          // Calculate render position including subtle depth parallax shift
          const renderX = p.x + currentMouseX * parallaxMaxX * p.depth;
          const renderY = p.y + currentMouseY * parallaxMaxY * p.depth;

          ctx.save();
          ctx.translate(renderX, renderY);
          ctx.rotate(p.rotation);

          ctx.fillStyle = `rgba(25, 26, 26, ${currentOpacity.toFixed(3)})`;
          ctx.strokeStyle = `rgba(25, 26, 26, ${currentOpacity.toFixed(3)})`;
          ctx.lineWidth = 1;

          if (p.type === "dot") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (p.type === "plus") {
            const s = p.size;
            ctx.beginPath();
            ctx.moveTo(-s, 0);
            ctx.lineTo(s, 0);
            ctx.moveTo(0, -s);
            ctx.lineTo(0, s);
            ctx.stroke();
          } else if (p.type === "ring") {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.restore();

          // Respawn offscreen
          if (!reduceMotion && (p.y < -30 || p.x < -30 || p.x > width + 30)) {
            particles[idx] = createMark(false);
          }
        });
      }

      if (!reduceMotion) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    resize();
    if (!reduceMotion) {
      animFrameId = requestAnimationFrame(render);
    } else {
      render(); // Single pass render for reduced motion
    }

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`shared-particles-layer ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="shared-particles-canvas" />
    </div>
  );
}
