"use client";

import { useState, useEffect, useRef, useCallback, MouseEvent, TouchEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import type { Project } from "@/app/lib/data";
import { ProjectOverlay } from "@/app/components/project-overlay";

interface ProjectCarouselProps {
  projects: Project[];
}

export const CATEGORY_GROUPS = [
  { label: "ALL", filter: "ALL" },
  { label: "BRAND & CAMPAIGNS", filter: "BRAND" },
  { label: "WEBSITE & UI/UX", filter: "UI/UX" },
  { label: "PRINT & EDITORIAL", filter: "PRINT" },
  { label: "POSTER & LOGO", filter: "POSTER" },
];

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStartX, setDragStartX] = useState<number>(0);
  const [dragDeltaX, setDragDeltaX] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  const isClickPrevented = useRef<boolean>(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Filter projects based on group selection
  const filteredProjects = projects.filter((p) => {
    if (selectedFilter === "ALL") return true;
    const cat = p.category.toLowerCase();
    if (selectedFilter === "BRAND") {
      return cat.includes("brand") || cat.includes("campaign") || cat.includes("advertising");
    }
    if (selectedFilter === "UI/UX") {
      return cat.includes("website") || cat.includes("ui/ux") || cat.includes("digital");
    }
    if (selectedFilter === "PRINT") {
      return cat.includes("print") || cat.includes("editorial") || cat.includes("information");
    }
    if (selectedFilter === "POSTER") {
      return cat.includes("poster") || cat.includes("logo") || cat.includes("applications");
    }
    return true;
  });

  const N = filteredProjects.length;
  // Create virtual repeated array for infinite looping
  const repeatCount = N > 1 ? Math.max(5, Math.ceil(18 / N)) : 1;
  const middleOffset = N > 1 ? N * Math.floor(repeatCount / 2) : 0;

  const [virtualIndex, setVirtualIndex] = useState<number>(middleOffset);

  // Expanded clone list for seamless infinity
  const displayItems = Array.from({ length: repeatCount }, () => filteredProjects).flat();

  // Selected project object for detail panel
  const activeOverlayProject = projects.find((p) => p.slug === selectedProjectSlug) || null;

  // Reset to middle offset when category filter changes
  useEffect(() => {
    const id = requestAnimationFrame(() => setVirtualIndex(middleOffset));
    return () => cancelAnimationFrame(id);
  }, [selectedFilter, middleOffset]);

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleNext = useCallback(() => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setVirtualIndex((prev) => prev + 1);
  }, [N]);

  const handlePrev = useCallback(() => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setVirtualIndex((prev) => prev - 1);
  }, [N]);

  // Handle seamless recenter on transition end
  const handleTransitionEnd = () => {
    if (N <= 1) return;
    const realIndex = ((virtualIndex % N) + N) % N;
    const minSafeIndex = N;
    const maxSafeIndex = N * (repeatCount - 1);

    if (virtualIndex < minSafeIndex || virtualIndex >= maxSafeIndex) {
      setIsTransitioning(false);
      setVirtualIndex(middleOffset + realIndex);
    }
  };

  // Autoplay timer (4 seconds) right-to-left
  useEffect(() => {
    if (isPaused || isDragging || prefersReducedMotion || N <= 1 || selectedProjectSlug !== null) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, isDragging, prefersReducedMotion, N, handleNext, selectedProjectSlug]);

  // Mouse / Touch Drag Handlers
  const handleDragStart = (clientX: number) => {
    if (N <= 1) return;
    setIsDragging(true);
    setIsTransitioning(false);
    setDragStartX(clientX);
    setDragDeltaX(0);
    isClickPrevented.current = false;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - dragStartX;
    setDragDeltaX(delta);
    if (Math.abs(delta) > 10) {
      isClickPrevented.current = true;
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsTransitioning(true);

    const stepWidth = 344; // 320px card width + 24px gap
    if (Math.abs(dragDeltaX) > 40) {
      const stepsToMove = Math.round(-dragDeltaX / stepWidth) || (dragDeltaX < 0 ? 1 : -1);
      setVirtualIndex((prev) => prev + stepsToMove);
    }
    setDragDeltaX(0);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedProjectSlug !== null) return;
    if (e.key === "ArrowRight") {
      handleNext();
    } else if (e.key === "ArrowLeft") {
      handlePrev();
    }
  };

  const [cardWidth, setCardWidth] = useState<number>(320);

  // Measure card width dynamically on mount and resize for accurate touch swipe positioning
  useEffect(() => {
    const updateCardWidth = () => {
      if (trackRef.current?.firstElementChild) {
        const w = (trackRef.current.firstElementChild as HTMLElement).offsetWidth;
        if (w > 0) setCardWidth(w);
      }
    };
    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  const currentRealIndex = N > 0 ? ((virtualIndex % N) + N) % N : 0;
  const stepWidth = cardWidth + 24;

  return (
    <div
      className="project-carousel-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handleDragEnd();
      }}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Selected Work Carousel"
    >
      {/* Category Filter Bar */}
      <div className="carousel-filter-bar" role="tablist" aria-label="Project Categories">
        {CATEGORY_GROUPS.map((group) => (
          <button
            key={group.filter}
            type="button"
            role="tab"
            aria-selected={selectedFilter === group.filter}
            className={`filter-pill ${selectedFilter === group.filter ? "is-active" : ""}`}
            onClick={() => setSelectedFilter(group.filter)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {/* Carousel Viewport & Infinite Track */}
      <div
        className={`carousel-viewport ${isDragging ? "is-dragging" : ""}`}
        onMouseDown={(e: MouseEvent) => handleDragStart(e.clientX)}
        onMouseMove={(e: MouseEvent) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onTouchStart={(e: TouchEvent) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e: TouchEvent) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        <div
          ref={trackRef}
          className={`carousel-track ${isTransitioning ? "has-transition" : "no-transition"}`}
          onTransitionEnd={handleTransitionEnd}
          style={{
            transform: `translateX(calc(50% - ${cardWidth / 2}px - ${virtualIndex * stepWidth}px + ${dragDeltaX}px))`,
          }}
        >
          {displayItems.map((project, itemIdx) => {
            const isCurrentActive = itemIdx === virtualIndex;
            return (
              <div
                key={`${project.slug}-${itemIdx}`}
                className={`carousel-card-item ${isCurrentActive ? "is-active" : ""}`}
                aria-hidden={!isCurrentActive}
              >
                <div
                  className="carousel-card-link"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open ${project.title} project details`}
                  onClick={() => {
                    if (!isClickPrevented.current) {
                      setSelectedProjectSlug(project.slug);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedProjectSlug(project.slug);
                    }
                  }}
                >
                  <motion.div
                    className="carousel-image-box"
                    layoutId={`project-card-${project.slug}`}
                  >
                    <Image
                      src={project.cover}
                      alt={`${project.title} cover preview`}
                      fill
                      draggable={false}
                      sizes="(max-width: 760px) 85vw, 320px"
                      priority={itemIdx >= middleOffset - 2 && itemIdx <= middleOffset + 4}
                    />
                  </motion.div>
                  <div className="carousel-card-caption">
                    <span className="caption-num">
                      {String((itemIdx % N) + 1).padStart(2, "0")}
                    </span>
                    <h3 className="caption-title">{project.title}</h3>
                    <span className="caption-category">{project.category}</span>
                    <span className="caption-arrow" aria-hidden="true">↗</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Bottom Controls & Counter */}
      {N > 1 && (
        <div className="carousel-controls-bar">
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={handlePrev}
            aria-label="Previous project"
          >
            ←
          </button>
          <span className="carousel-counter">
            <strong>{String(currentRealIndex + 1).padStart(2, "0")}</strong> /{" "}
            {String(N).padStart(2, "0")}
          </span>
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={handleNext}
            aria-label="Previous project"
          >
            →
          </button>
        </div>
      )}

      {/* In-Page Project Detail Overlay */}
      <AnimatePresence>
        {activeOverlayProject && (
          <ProjectOverlay
            project={activeOverlayProject}
            allProjects={projects}
            onClose={() => setSelectedProjectSlug(null)}
            onSelectProject={(slug) => setSelectedProjectSlug(slug)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

