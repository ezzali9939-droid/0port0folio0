"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  width: number;
}

export function BackgroundShootingStars({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animFrameId: number;
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];

    const createParticle = (randomY = false): Particle => {
      const angle = (-30 * Math.PI) / 180; // 30 deg upward trajectory rightwards
      return {
        x: Math.random() * width * 1.2 - width * 0.1,
        y: randomY ? Math.random() * height : height + Math.random() * 100,
        length: Math.random() * 24 + 14,
        speed: Math.random() * 1.8 + 1.2,
        angle,
        opacity: Math.random() * 0.12 + 0.08, // Subtle 8% - 20% opacity
        width: Math.random() * 0.6 + 0.8,
      };
    };

    const initParticles = () => {
      particles = [];
      const count = Math.max(8, Math.floor(width / 140));
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(true));
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
      { threshold: 0.05 }
    );
    observer.observe(container);

    const render = () => {
      if (isIntersecting && width > 0 && height > 0) {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, idx) => {
          const dx = Math.cos(p.angle) * p.speed;
          const dy = Math.sin(p.angle) * p.speed;

          p.x += dx;
          p.y += dy;

          // Head and tail points
          const tailX = p.x - Math.cos(p.angle) * p.length;
          const tailY = p.y - Math.sin(p.angle) * p.length;

          // Draw shooting star gradient line
          const gradient = ctx.createLinearGradient(tailX, tailY, p.x, p.y);
          gradient.addColorStop(0, "rgba(25, 26, 26, 0)");
          gradient.addColorStop(1, `rgba(25, 26, 26, ${p.opacity})`);

          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = p.width;
          ctx.lineCap = "round";
          ctx.stroke();

          // Respawn off-screen particles
          if (p.x > width + 100 || p.y < -100) {
            particles[idx] = createParticle(false);
          }
        });
      }

      animFrameId = requestAnimationFrame(render);
    };

    resize();
    animFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`background-shooting-stars-container ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="background-shooting-stars-canvas" />
    </div>
  );
}
