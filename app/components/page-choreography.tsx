"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function PageChoreography() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const ctx = gsap.context(() => {
      // 1. Home Page Choreography
      if (pathname === "/") {
        // Hero Title Parallax
        const heroTitle = document.querySelector(".hero-title-bg");
        if (heroTitle) {
          gsap.to(heroTitle, {
            yPercent: -12,
            ease: "none",
            scrollTrigger: { trigger: ".hero-home", start: "top top", end: "bottom top", scrub: 0.8 },
          });
        }

        // Home Portrait Reveal Clip
        const homePortrait = document.querySelector(".home-portrait img");
        if (homePortrait) {
          gsap.fromTo(
            homePortrait,
            { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0% 100%)", scale: 1.04 },
            {
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
              scale: 1,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: { trigger: ".home-portrait", start: "top 80%" },
            }
          );
        }

        // Tools Ring Inertial Drift
        const toolsRing = document.querySelector(".ring-panel img");
        if (toolsRing) {
          gsap.to(toolsRing, {
            rotation: 4,
            y: -15,
            ease: "none",
            scrollTrigger: { trigger: ".ring-panel", start: "top bottom", end: "bottom top", scrub: 1.2 },
          });
        }
      }

      // 2. About Page Choreography
      if (pathname === "/about") {
        // About Title Slice Shift
        const aboutTitle = document.querySelector(".about-title");
        if (aboutTitle) {
          gsap.fromTo(
            aboutTitle,
            { x: -30, opacity: 0.8 },
            {
              x: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: { trigger: ".hero-about", start: "top 75%" },
            }
          );
        }

        // Practice Ribbon Drift
        const ribbon = document.querySelector(".ribbon-panel img");
        if (ribbon) {
          gsap.to(ribbon, {
            xPercent: -6,
            ease: "none",
            scrollTrigger: { trigger: ".ribbon-panel", start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }

        // Thinking Layers Separation & Alignment
        const thinkingLayers = document.querySelector(".layers-panel img");
        if (thinkingLayers) {
          gsap.fromTo(
            thinkingLayers,
            { scale: 0.96, y: 20 },
            {
              scale: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: ".layers-panel", start: "top 85%", end: "center center", scrub: 0.6 },
            }
          );
        }
      }

      // 3. Work Page Choreography
      if (pathname === "/work") {
        // Process Stages Illumination
        const processPanel = document.querySelector(".process-panel img");
        if (processPanel) {
          gsap.fromTo(
            processPanel,
            { filter: "brightness(0.85) contrast(0.95)", y: 15 },
            {
              filter: "brightness(1) contrast(1)",
              y: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: ".process-panel", start: "top 80%", end: "center center", scrub: 0.8 },
            }
          );
        }

        // Gyroscope Restrained 2.5D Rotation
        const gyroPanel = document.querySelector(".gyro-panel img");
        if (gyroPanel) {
          gsap.to(gyroPanel, {
            rotation: -5,
            scale: 1.02,
            ease: "none",
            scrollTrigger: { trigger: ".gyro-panel", start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }
      }

      // 4. Contact Page Choreography
      if (pathname === "/contact") {
        const pipeline = document.querySelector(".pipeline-panel img");
        if (pipeline) {
          gsap.fromTo(
            pipeline,
            { opacity: 0.8, y: 18 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: ".pipeline-panel", start: "top 80%" },
            }
          );
        }

        const calibration = document.querySelector(".calibration-panel img");
        if (calibration) {
          gsap.to(calibration, {
            y: -12,
            ease: "none",
            scrollTrigger: { trigger: ".calibration-panel", start: "top bottom", end: "bottom top", scrub: 1 },
          });
        }
      }

      // 5. Shared CTA Metal Frame Soft Highlight
      const ctaFrame = document.querySelector(".cta-frame img");
      if (ctaFrame) {
        gsap.fromTo(
          ctaFrame,
          { filter: "brightness(0.9)" },
          {
            filter: "brightness(1.1)",
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: ".project-cta", start: "top 75%", toggleActions: "play none none reverse" },
          }
        );
      }
    });

    return () => {
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
