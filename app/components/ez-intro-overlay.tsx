/* eslint-disable @next/next/no-img-element */
"use client";

import gsap from "gsap";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// The 6 exact dual-color logo piece pairs.
// Every PNG is a 956x412 full-canvas asset.
// When wrapper transform reaches identity (x=0, y=0, z=0, rot=0, scale=1),
// white pieces reconstruct ez-logo-exact-white.png and black pieces reconstruct ez-logo-exact-black.png.
const PIECE_PAIRS = [
  {
    id: "p01",
    className: "ez-piece-p01",
    white: "/assets/intro/piece-01-e-top-white.png",
    black: "/assets/intro/piece-01-e-top-black.png",
    startX: -140,
    startY: -90,
    startZ: 160,
    rotX: 24,
    rotY: -15,
    rotZ: -12,
  },
  {
    id: "p02",
    className: "ez-piece-p02",
    white: "/assets/intro/piece-02-e-middle-white.png",
    black: "/assets/intro/piece-02-e-middle-black.png",
    startX: 0,
    startY: 0,
    startZ: 280,
    rotX: -10,
    rotY: 20,
    rotZ: 8,
  },
  {
    id: "p03",
    className: "ez-piece-p03",
    white: "/assets/intro/piece-03-e-bottom-white.png",
    black: "/assets/intro/piece-03-e-bottom-black.png",
    startX: -130,
    startY: 90,
    startZ: 140,
    rotX: -22,
    rotY: -10,
    rotZ: 14,
  },
  {
    id: "p04",
    className: "ez-piece-p04",
    white: "/assets/intro/piece-04-z-top-white.png",
    black: "/assets/intro/piece-04-z-top-black.png",
    startX: 140,
    startY: -90,
    startZ: 140,
    rotX: 20,
    rotY: 15,
    rotZ: 12,
  },
  {
    id: "p05",
    className: "ez-piece-p05",
    white: "/assets/intro/piece-05-z-diagonal-white.png",
    black: "/assets/intro/piece-05-z-diagonal-black.png",
    startX: 120,
    startY: -50,
    startZ: 220,
    rotX: 15,
    rotY: 25,
    rotZ: -28,
  },
  {
    id: "p06",
    className: "ez-piece-p06",
    white: "/assets/intro/piece-06-z-bottom-white.png",
    black: "/assets/intro/piece-06-z-bottom-black.png",
    startX: 130,
    startY: 90,
    startZ: 140,
    rotX: -20,
    rotY: 12,
    rotZ: -14,
  },
];

// Controlled, intentional geometric system around the EZ logo
interface GeoElement {
  id: string;
  type: "dot" | "cross" | "line" | "arc" | "marker";
  top: string;
  left: string;
  size: number;
  depth: number;
  rotation?: number;
  lineWidth?: number;
  driftX: number;
  driftY: number;
  rotateDelta?: number;
  floatDuration: number;
  scaleBreath?: number;
  mobileHidden?: boolean;
}

const GEOMETRIC_ELEMENTS: GeoElement[] = [
  { id: "g01", type: "marker", top: "18%", left: "14%", size: 16, depth: 100, rotation: 0, driftX: 18, driftY: 12, rotateDelta: 90, floatDuration: 4.2 },
  { id: "g02", type: "cross", top: "26%", left: "24%", size: 12, depth: 140, driftX: -14, driftY: 16, rotateDelta: 360, floatDuration: 5.5 },
  { id: "g03", type: "dot", top: "35%", left: "34%", size: 4, depth: 180, driftX: 10, driftY: -15, floatDuration: 3.8, scaleBreath: 0.25 },
  { id: "g04", type: "line", top: "22%", left: "68%", size: 28, depth: 120, lineWidth: 28, driftX: -22, driftY: 8, rotateDelta: 15, floatDuration: 4.8 },
  { id: "g05", type: "arc", top: "24%", left: "82%", size: 36, depth: 80, driftX: 16, driftY: -18, rotateDelta: 360, floatDuration: 6.2 },
  { id: "g06", type: "marker", top: "20%", left: "88%", size: 16, depth: 110, rotation: 90, driftX: -12, driftY: 20, rotateDelta: -90, floatDuration: 5.0, mobileHidden: true },
  { id: "g07", type: "dot", top: "74%", left: "28%", size: 4, depth: 160, driftX: -16, driftY: -12, floatDuration: 3.5, scaleBreath: 0.3 },
  { id: "g08", type: "cross", top: "76%", left: "76%", size: 12, depth: 130, rotation: 45, driftX: 20, driftY: -14, rotateDelta: 180, floatDuration: 4.6 },
  { id: "g09", type: "line", top: "80%", left: "50%", size: 24, depth: 200, rotation: 90, lineWidth: 24, driftX: -8, driftY: -22, rotateDelta: -30, floatDuration: 5.8, mobileHidden: true },
  { id: "g10", type: "arc", top: "70%", left: "16%", size: 32, depth: 150, driftX: 22, driftY: 14, rotateDelta: -360, floatDuration: 6.8, mobileHidden: true },
  { id: "g11", type: "marker", top: "82%", left: "86%", size: 16, depth: 90, rotation: 180, driftX: -18, driftY: -10, rotateDelta: 90, floatDuration: 4.4 },
];

function GeometricIcon({ type, rotation }: { type: GeoElement["type"]; rotation?: number }) {
  const transform = rotation ? `rotate(${rotation}deg)` : undefined;
  if (type === "dot") {
    return <div className="ez-geo-dot" style={{ transform }} />;
  }
  if (type === "line") {
    return <div className="ez-geo-line" style={{ transform }} />;
  }
  if (type === "cross") {
    return (
      <svg viewBox="0 0 12 12" className="ez-geo-svg" style={{ transform }}>
        <path d="M 6 0 V 12 M 0 6 H 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="square" />
      </svg>
    );
  }
  if (type === "arc") {
    return (
      <svg viewBox="0 0 36 36" className="ez-geo-svg" style={{ transform }}>
        <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="24 16" />
      </svg>
    );
  }
  if (type === "marker") {
    return (
      <svg viewBox="0 0 16 16" className="ez-geo-svg" style={{ transform }}>
        <path d="M 0 16 V 0 H 16" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }
  return null;
}

function getIntroSnapshot() {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return params.get("intro_test") === "true" || sessionStorage.getItem("ez_intro_seen") !== "true";
}

export function EZIntroOverlay() {
  const mounted = useIsMounted();
  const shouldRenderFromStore = useSyncExternalStore(
    emptySubscribe,
    getIntroSnapshot,
    () => false
  );
  const [dismissed, setDismissed] = useState(false);
  const shouldRender = mounted && shouldRenderFromStore && !dismissed;

  const overlayRef = useRef<HTMLDivElement>(null);
  const darkLayerRef = useRef<HTMLDivElement>(null);
  const lightLayerRef = useRef<HTMLDivElement>(null);
  const sloganDarkRef = useRef<HTMLImageElement>(null);
  const sloganLightRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!mounted || !shouldRender || !overlayRef.current) return;

    // Lock scroll and pointer interactions during intro
    document.body.style.overflow = "hidden";
    document.body.style.pointerEvents = "none";

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const travelMult = isMobile ? 0.45 : 1;

    // Reduced motion fallback: hold assembled logo briefly, then fade into Home
    if (reduceMotion) {
      const rmTl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("ez_intro_seen", "true");
          document.body.style.overflow = "";
          document.body.style.pointerEvents = "";
          setDismissed(true);
        },
      });

      rmTl.to(overlayRef.current, { opacity: 0, duration: 0.4, delay: 0.5, ease: "power2.inOut" });
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Setup & launch continuous ambient kinetic motion loops for geometric elements
      GEOMETRIC_ELEMENTS.forEach((el) => {
        const selectors = `.ez-geo-${el.id}`;
        gsap.set(selectors, {
          z: isMobile ? el.depth * 0.4 : el.depth,
          opacity: 0,
          scale: 0.8,
          transformOrigin: "50% 50%",
        });

        // Continuous Ambient Drifting (never stops)
        const duration = el.floatDuration || 4.5;
        const dx = el.driftX * (isMobile ? 0.5 : 1);
        const dy = el.driftY * (isMobile ? 0.5 : 1);

        gsap.to(selectors, {
          x: `+=${dx}`,
          y: `+=${dy}`,
          duration: duration,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // Continuous Ambient Rotation
        if (el.rotateDelta) {
          gsap.to(selectors, {
            rotation: `+=${el.rotateDelta}`,
            duration: duration * 1.6,
            ease: "none",
            repeat: -1,
          });
        }

        // Continuous Subtle Scale Breathing
        if (el.scaleBreath) {
          gsap.to(selectors, {
            scale: 1 + el.scaleBreath,
            duration: duration * 0.85,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        }
      });

      // 2. Initial setup for 3D logo piece wrappers in both layers
      PIECE_PAIRS.forEach((config) => {
        const selectors = `.${config.className}`;
        gsap.set(selectors, {
          x: config.startX * travelMult,
          y: config.startY * travelMult,
          z: config.startZ * travelMult,
          rotationX: config.rotX,
          rotationY: config.rotY,
          rotationZ: config.rotZ,
          opacity: 0,
          transformOrigin: "50% 50%",
        });
      });

      // Clip light layer to 0% width initially (pure black dark layer underneath)
      if (lightLayerRef.current) {
        gsap.set(lightLayerRef.current, { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)" });
      }

      [sloganDarkRef.current, sloganLightRef.current].forEach((sloganEl) => {
        if (sloganEl) {
          gsap.set(sloganEl, { clipPath: "inset(0 100% 0 0)", opacity: 0 });
        }
      });

      // Master Entrance Timeline (0.00s – 3.75s)
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("ez_intro_seen", "true");
          document.body.style.overflow = "";
          document.body.style.pointerEvents = "";
          setDismissed(true);
        },
      });

      // 0.05s – 0.65s: Soft fade-in of controlled geometric markers
      GEOMETRIC_ELEMENTS.forEach((el) => {
        tl.to(
          `.ez-geo-${el.id}`,
          {
            opacity: 0.85,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
          },
          0.05
        );
      });


      // 0.25s – 1.85s: Synchronized 3D assembly of EZ logo pieces
      PIECE_PAIRS.forEach((config) => {
        const selectors = `.${config.className}`;
        tl.to(
          selectors,
          {
            x: 0,
            y: 0,
            z: 0,
            rotationX: 0,
            rotationY: 0,
            rotationZ: 0,
            opacity: 1,
            duration: config.id === "p05" ? 1.6 : 1.45,
            ease: "power3.out",
          },
          0.25
        );
      });


      // 0.50s – 1.90s: Spatial background wipe sweep (Layer B clipPath 0% -> 100%)
      // All surrounding elements and logo pieces invert color spatially as the wipe boundary passes underneath!
      if (lightLayerRef.current) {
        tl.to(
          lightLayerRef.current,
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.4,
            ease: "power2.inOut",
          },
          0.5
        );
      }

      // 1.95s – 2.45s: Synchronized subtle magnetic pulse / orbital movement at logo completion
      tl.to(
        ".ez-logo-stage",
        {
          scale: 1.018,
          rotationY: isMobile ? 0 : 2.5,
          rotationX: isMobile ? 0 : -1.5,
          duration: 0.35,
          ease: "quad.out",
        },
        1.95
      ).to(
        ".ez-logo-stage",
        {
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          duration: 0.35,
          ease: "quad.inOut",
        },
        2.3
      );

      // 2.40s – 2.95s: Reveal exact slogan artwork below monogram
      [sloganDarkRef.current, sloganLightRef.current].forEach((sloganEl) => {
        if (sloganEl) {
          tl.to(
            sloganEl,
            {
              clipPath: "inset(0 0% 0 0)",
              opacity: 1,
              duration: 0.55,
              ease: "power2.out",
            },
            2.4
          );
        }
      });

      // 3.05s – 3.70s: Seamless Editorial Transition into Homepage
      tl.to(
        ".ez-logo-stage",
        {
          scale: isMobile ? 0.88 : 0.92,
          y: isMobile ? -10 : -16,
          opacity: 0,
          duration: 0.6,
          ease: "power3.inOut",
        },
        3.05
      )
        .to(
          ".ez-intro-accent-layer",
          {
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          3.05
        )
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.45,
            ease: "power2.inOut",
          },
          3.25
        );
    }, overlayRef);

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, [mounted, shouldRender]);

  if (!mounted || !shouldRender) return null;

  return (
    <div ref={overlayRef} className="ez-intro-overlay-root" role="dialog" aria-label="Adaptive Contrast Intro Animation">
      {/* Layer A: Base Dark Stage (#141414 Backdrop, Native White PNG Artwork & White Accents) */}
      <div ref={darkLayerRef} className="ez-intro-layer ez-layer-dark">
        <div className="ez-intro-accent-layer ez-accent-white" aria-hidden="true">
          {GEOMETRIC_ELEMENTS.map((el) => (
            <div
              key={el.id}
              className={`ez-geo-element ez-geo-${el.id} ${el.mobileHidden ? "ez-mobile-hidden" : ""}`}
              style={{ top: el.top, left: el.left, width: el.size, height: el.size }}
            >
              <GeometricIcon type={el.type} rotation={el.rotation} />
            </div>
          ))}
        </div>

        <div className="ez-logo-stage">
          {PIECE_PAIRS.map((piece) => (
            <div key={piece.id} className={`ez-piece-wrapper ${piece.className}`} data-piece={piece.id}>
              <img src={piece.white} alt="" className="ez-piece-child" />
            </div>
          ))}

          <img
            ref={sloganDarkRef}
            src="/assets/intro/ez-slogan-exact-white.png"
            alt="Designs that speak. Stories that last."
            className="ez-slogan-layer"
          />
        </div>
      </div>

      {/* Layer B: Light Plane Sweep (Website Light Canvas Backdrop #eee8e2, Native Black PNG Artwork & Black Accents) */}
      <div ref={lightLayerRef} className="ez-intro-layer ez-layer-light" aria-hidden="true">
        <div className="ez-intro-accent-layer ez-accent-black" aria-hidden="true">
          {GEOMETRIC_ELEMENTS.map((el) => (
            <div
              key={el.id}
              className={`ez-geo-element ez-geo-${el.id} ${el.mobileHidden ? "ez-mobile-hidden" : ""}`}
              style={{ top: el.top, left: el.left, width: el.size, height: el.size }}
            >
              <GeometricIcon type={el.type} rotation={el.rotation} />
            </div>
          ))}
        </div>

        <div className="ez-logo-stage">
          {PIECE_PAIRS.map((piece) => (
            <div key={piece.id} className={`ez-piece-wrapper ${piece.className}`} data-piece={piece.id}>
              <img src={piece.black} alt="" className="ez-piece-child" />
            </div>
          ))}

          <img
            ref={sloganLightRef}
            src="/assets/intro/ez-slogan-exact-black.png"
            alt="Designs that speak. Stories that last."
            className="ez-slogan-layer"
          />
        </div>
      </div>
    </div>
  );
}


