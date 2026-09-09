"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export function MetallicFrame() {
  const [isHovered, setIsHovered] = useState(false);
  const [hasScrolledIntoView, setHasScrolledIntoView] = useState(false);
  const containerRef = useRef<HTMLAnchorElement>(null);
  const [isTouchDevice] = useState(() => {
    if (typeof window === "undefined") return false;
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  });

  useEffect(() => {
    if (!isTouchDevice || !containerRef.current) return;

    // IntersectionObserver for touch auto-reveal when scrolled into view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasScrolledIntoView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isTouchDevice]);

  const activeState = isHovered || (isTouchDevice && hasScrolledIntoView);

  return (
    <Link
      ref={containerRef}
      href="/contact"
      aria-label="Go to Contact"
      className={`metallic-frame-container ${activeState ? "is-active" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {/* Base Metallic Frame Image */}
      <Image
        src="/assets/page-assets/global/project-cta-frame.webp"
        alt="Metallic frame marking the next project"
        fill
        priority
        sizes="(max-width: 760px) 90vw, 48vw"
        className="metallic-frame-image"
      />

      {/* Clipped Dark Aperture Overlay */}
      <div className="metallic-frame-aperture">
        {/* SVG Interior Design Illustrations */}
        <svg
          viewBox="0 0 700 480"
          className="frame-svg-overlay"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* GROUP 1: Primary Outlines & Framework */}
          <g className="svg-group-outlines">
            {/* Top-Left UI Card Container */}
            <rect x="35" y="25" width="210" height="145" rx="5" className="draw-path" />
            <line x1="35" y1="48" x2="245" y2="48" className="draw-path" />

            {/* Top-Left Hero Wireframe Box */}
            <rect x="43" y="56" width="105" height="58" rx="2" className="draw-path" />

            {/* Top-Right Slider Control Box */}
            <rect x="475" y="25" width="95" height="48" rx="5" className="draw-path" />

            {/* Bottom-Left Profile Card Container */}
            <rect x="35" y="240" width="210" height="145" rx="5" className="draw-path" />

            {/* Bottom-Right Wireframe Box */}
            <rect x="525" y="325" width="55" height="46" rx="3" className="draw-path" />

            {/* Major Axes & Coordinate Lines */}
            <line x1="275" y1="35" x2="275" y2="125" className="draw-path" />
            <line x1="275" y1="35" x2="435" y2="35" className="draw-path" />

            {/* Top Bézier Curve */}
            <path d="M 275 110 C 275 55, 335 35, 385 35" className="draw-path curve-path" />

            {/* Bottom Bézier Curve Graph */}
            <path d="M 465 425 C 495 380, 525 435, 555 390" className="draw-path curve-path" />
          </g>

          {/* GROUP 2: Detailed Wireframe Content, Lines & Typography */}
          <g className="svg-group-details">
            {/* Top-Left Header Control Dots */}
            <circle cx="47" cy="36" r="2.2" fill="currentColor" />
            <circle cx="55" cy="36" r="2.2" fill="currentColor" />
            <circle cx="63" cy="36" r="2.2" fill="currentColor" />

            {/* Top-Left Hero Cross-hatch */}
            <line x1="43" y1="56" x2="148" y2="114" className="draw-path detail-line" />
            <line x1="148" y1="56" x2="43" y2="114" className="draw-path detail-line" />

            {/* Top-Left Text Lines */}
            <line x1="160" y1="62" x2="235" y2="62" className="draw-path detail-line" />
            <line x1="160" y1="72" x2="225" y2="72" className="draw-path detail-line" />
            <line x1="160" y1="82" x2="230" y2="82" className="draw-path detail-line" />
            <line x1="160" y1="92" x2="210" y2="92" className="draw-path detail-line" />
            <line x1="160" y1="102" x2="235" y2="102" className="draw-path detail-line" />

            {/* Top-Left 3 Thumbnail Cards */}
            <rect x="43" y="121" width="30" height="22" rx="2" className="draw-path detail-line" />
            <line x1="43" y1="121" x2="73" y2="143" className="draw-path detail-line" />
            <line x1="73" y1="121" x2="43" y2="143" className="draw-path detail-line" />

            <rect x="80" y="121" width="30" height="22" rx="2" className="draw-path detail-line" />
            <line x1="80" y1="121" x2="110" y2="143" className="draw-path detail-line" />
            <line x1="110" y1="121" x2="80" y2="143" className="draw-path detail-line" />

            <rect x="117" y="121" width="30" height="22" rx="2" className="draw-path detail-line" />
            <line x1="117" y1="121" x2="147" y2="143" className="draw-path detail-line" />
            <line x1="147" y1="121" x2="117" y2="143" className="draw-path detail-line" />

            {/* Top-Right Curve Nodes & Handle Lines */}
            <circle cx="275" cy="110" r="3" fill="currentColor" />
            <circle cx="385" cy="35" r="3" fill="currentColor" />
            <rect x="272" y="32" width="6" height="6" />
            <line x1="275" y1="35" x2="275" y2="110" strokeDasharray="3 3" className="detail-line" />
            <line x1="275" y1="35" x2="385" y2="35" strokeDasharray="3 3" className="detail-line" />

            {/* Top-Right Grid Lines */}
            <g opacity="0.6">
              <line x1="330" y1="15" x2="330" y2="95" strokeDasharray="2 3" className="detail-line" />
              <line x1="350" y1="15" x2="350" y2="95" strokeDasharray="2 3" className="detail-line" />
              <line x1="370" y1="15" x2="370" y2="95" strokeDasharray="2 3" className="detail-line" />
              <line x1="390" y1="15" x2="390" y2="95" strokeDasharray="2 3" className="detail-line" />
              <line x1="410" y1="15" x2="410" y2="95" strokeDasharray="2 3" className="detail-line" />
              <line x1="430" y1="15" x2="430" y2="95" strokeDasharray="2 3" className="detail-line" />

              <line x1="310" y1="35" x2="445" y2="35" strokeDasharray="2 3" className="detail-line" />
              <line x1="310" y1="55" x2="445" y2="55" strokeDasharray="2 3" className="detail-line" />
              <line x1="310" y1="75" x2="445" y2="75" strokeDasharray="2 3" className="detail-line" />
            </g>

            {/* Top-Right Slider Controls */}
            <circle cx="495" cy="45" r="7" className="draw-path" />
            <line x1="510" y1="40" x2="555" y2="40" className="draw-path detail-line" />
            <line x1="510" y1="50" x2="540" y2="50" className="draw-path detail-line" />

            {/* Vertical Dot Matrix (Top-Right) */}
            <circle cx="530" cy="85" r="1.8" fill="currentColor" />
            <circle cx="530" cy="95" r="1.8" fill="currentColor" />
            <circle cx="530" cy="105" r="1.8" fill="currentColor" />
            <circle cx="530" cy="115" r="1.8" fill="currentColor" />

            {/* Bottom-Left Profile Card Elements */}
            <circle cx="62" cy="270" r="13" className="draw-path" />
            <line x1="85" y1="264" x2="210" y2="264" className="draw-path detail-line" />
            <line x1="85" y1="274" x2="175" y2="274" className="draw-path detail-line" />

            {/* Profile Pill Buttons */}
            <rect x="50" y="294" width="38" height="12" rx="6" className="draw-path detail-line" />
            <rect x="94" y="294" width="38" height="12" rx="6" className="draw-path detail-line" />
            <rect x="138" y="294" width="38" height="12" rx="6" className="draw-path detail-line" />

            {/* Profile Inner Wireframe Card */}
            <rect x="50" y="316" width="180" height="52" rx="3" className="draw-path detail-line" />
            <line x1="50" y1="316" x2="230" y2="368" className="draw-path detail-line" />
            <line x1="230" y1="316" x2="50" y2="368" className="draw-path detail-line" />

            {/* Bottom-Left Grid Floor & Arc */}
            <g opacity="0.65">
              <line x1="35" y1="395" x2="280" y2="395" className="detail-line" />
              <line x1="35" y1="410" x2="280" y2="410" strokeDasharray="2 3" className="detail-line" />
              <line x1="35" y1="425" x2="280" y2="425" strokeDasharray="2 3" className="detail-line" />
              <line x1="35" y1="440" x2="280" y2="440" strokeDasharray="2 3" className="detail-line" />

              <line x1="70" y1="390" x2="70" y2="450" strokeDasharray="2 3" className="detail-line" />
              <line x1="105" y1="390" x2="105" y2="450" strokeDasharray="2 3" className="detail-line" />
              <line x1="140" y1="390" x2="140" y2="450" strokeDasharray="2 3" className="detail-line" />
              <line x1="175" y1="390" x2="175" y2="450" strokeDasharray="2 3" className="detail-line" />
              <line x1="210" y1="390" x2="210" y2="450" strokeDasharray="2 3" className="detail-line" />
              <line x1="245" y1="390" x2="245" y2="450" strokeDasharray="2 3" className="detail-line" />
              <path d="M 245 395 A 40 40 0 0 1 205 435" className="detail-line" />
            </g>

            {/* Bottom-Right Typography "Aa" & Construction Lines */}
            <g className="svg-typography">
              {/* Construction Guides */}
              <line x1="475" y1="265" x2="575" y2="265" strokeDasharray="2 2" opacity="0.4" className="detail-line" />
              <line x1="475" y1="175" x2="575" y2="175" strokeDasharray="2 2" opacity="0.4" className="detail-line" />
              <line x1="515" y1="165" x2="515" y2="275" strokeDasharray="2 2" opacity="0.4" className="detail-line" />

              {/* Capital "A" */}
              <text
                x="478"
                y="262"
                fontSize="84"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                className="draw-path text-letter"
              >
                A
              </text>
              {/* Lowercase "a" */}
              <text
                x="538"
                y="262"
                fontSize="62"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
                className="draw-path text-letter"
              >
                a
              </text>

              {/* Vertical Dot Matrix (Middle-Right) */}
              <circle cx="530" cy="180" r="1.8" fill="currentColor" />
              <circle cx="530" cy="190" r="1.8" fill="currentColor" />
              <circle cx="530" cy="200" r="1.8" fill="currentColor" />
              <circle cx="530" cy="210" r="1.8" fill="currentColor" />
            </g>

            {/* Color Swatch Palette Boxes */}
            <rect x="525" y="280" width="10" height="10" fill="currentColor" opacity="0.9" />
            <rect x="539" y="280" width="10" height="10" fill="currentColor" opacity="0.65" />
            <rect x="553" y="280" width="10" height="10" fill="currentColor" opacity="0.4" />
            <rect x="567" y="280" width="10" height="10" fill="currentColor" opacity="0.2" />

            {/* Middle-Right UI Text Placeholder Lines */}
            <line x1="465" y1="330" x2="510" y2="330" className="draw-path detail-line" />
            <line x1="465" y1="340" x2="500" y2="340" className="draw-path detail-line" />
            <line x1="465" y1="350" x2="505" y2="350" className="draw-path detail-line" />
            <line x1="465" y1="360" x2="490" y2="360" className="draw-path detail-line" />

            {/* Bottom-Right Box Cross-hatch */}
            <line x1="525" y1="325" x2="580" y2="371" className="draw-path detail-line" />
            <line x1="580" y1="325" x2="525" y2="371" className="draw-path detail-line" />

            {/* Bottom-Right Grid Graph */}
            <g opacity="0.6">
              <line x1="435" y1="410" x2="585" y2="410" strokeDasharray="2 3" className="detail-line" />
              <line x1="435" y1="425" x2="585" y2="425" strokeDasharray="2 3" className="detail-line" />
              <line x1="435" y1="440" x2="585" y2="440" strokeDasharray="2 3" className="detail-line" />

              <line x1="465" y1="395" x2="465" y2="455" strokeDasharray="2 3" className="detail-line" />
              <line x1="495" y1="395" x2="495" y2="455" strokeDasharray="2 3" className="detail-line" />
              <line x1="525" y1="395" x2="525" y2="455" strokeDasharray="2 3" className="detail-line" />
              <line x1="555" y1="395" x2="555" y2="455" strokeDasharray="2 3" className="detail-line" />

              {/* Bézier Nodes */}
              <circle cx="465" cy="425" r="2.5" fill="currentColor" />
              <circle cx="510" cy="385" r="2.5" fill="currentColor" />
              <circle cx="555" cy="390" r="2.5" fill="currentColor" />
              <line x1="465" y1="425" x2="510" y2="385" strokeDasharray="2 2" className="detail-line" />
              <line x1="510" y1="385" x2="555" y2="390" strokeDasharray="2 2" className="detail-line" />
            </g>
          </g>
        </svg>

        {/* Crisp Live HTML Central Text */}
        <div className="cta-frame-text">
          <span className="text-eyebrow">NEXT / 00</span>
          <strong className="text-heading">YOUR PROJECT</strong>
        </div>
      </div>
    </Link>
  );
}
