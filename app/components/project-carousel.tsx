"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
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
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const pointerStartRef = useRef<{ x: number; y: number; scrollLeft: number }>({
    x: 0,
    y: 0,
    scrollLeft: 0,
  });
  const isSwipingRef = useRef<boolean>(false);

  // Filter projects based on category
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

  const totalCount = filteredProjects.length;

  // Selected project for detail panel overlay
  const activeOverlayProject = projects.find((p) => p.slug === selectedProjectSlug) || null;

  // Preload all project cover images upfront to prevent any blank image exposure
  useEffect(() => {
    projects.forEach((p) => {
      if (p.cover) {
        const img = new window.Image();
        img.src = p.cover;
      }
    });
  }, [projects]);

  // Scroll to a specific card index
  const scrollToIndex = useCallback((index: number, smooth = true) => {
    const container = scrollContainerRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    // Calculate left offset to center the card in container
    const containerWidth = container.offsetWidth;
    const cardWidth = card.offsetWidth;
    const cardLeft = card.offsetLeft;
    const targetScrollLeft = cardLeft - (containerWidth - cardWidth) / 2;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: smooth ? "smooth" : "auto",
    });
    setActiveIndex(index);
  }, []);

  // Reset to first card when category filter changes
  useEffect(() => {
    setActiveIndex(0);
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ left: 0, behavior: "auto" });
    }
  }, [selectedFilter]);

  // Detect active card on scroll using center alignment math
  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIndex = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - containerCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  const handlePrev = useCallback(() => {
    if (totalCount <= 1) return;
    const prevIdx = (activeIndex - 1 + totalCount) % totalCount;
    scrollToIndex(prevIdx);
  }, [activeIndex, totalCount, scrollToIndex]);

  const handleNext = useCallback(() => {
    if (totalCount <= 1) return;
    const nextIdx = (activeIndex + 1) % totalCount;
    scrollToIndex(nextIdx);
  }, [activeIndex, totalCount, scrollToIndex]);

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedProjectSlug !== null) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
  };

  // Pointer gesture handlers with clean tap/swipe disambiguation threshold (14px)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const container = scrollContainerRef.current;
    if (!container) return;

    setIsDragging(true);
    isSwipingRef.current = false;
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: container.scrollLeft,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;
    const distance = Math.hypot(deltaX, deltaY);

    // Distinguish intentional swipe gesture from a tap (14px threshold)
    if (distance > 14) {
      isSwipingRef.current = true;
    }

    // Support mouse drag panning
    if (e.pointerType === "mouse") {
      container.scrollLeft = pointerStartRef.current.scrollLeft - deltaX;
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    handleScroll();
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    if (isSwipingRef.current) {
      // User was intentionally swiping/dragging, suppress navigation
      e.preventDefault();
      e.stopPropagation();
      isSwipingRef.current = false;
      return;
    }

    // Normal click/tap: open detail overlay in-page
    e.preventDefault();
    setSelectedProjectSlug(slug);
  };

  return (
    <div
      className="project-carousel-wrapper"
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

      {/* Carousel Scroll Viewport */}
      <div
        ref={scrollContainerRef}
        className={`carousel-scroll-viewport ${isDragging ? "is-dragging" : ""}`}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="carousel-scroll-track">
          {filteredProjects.map((project, itemIdx) => {
            const isActive = itemIdx === activeIndex;
            return (
              <div
                key={project.slug}
                ref={(el) => {
                  cardRefs.current[itemIdx] = el;
                }}
                className={`carousel-card-item ${isActive ? "is-active" : ""}`}
              >
                <Link
                  href={`/work/${project.slug}`}
                  className="carousel-card-link"
                  aria-label={`Open ${project.title} project details`}
                  onClick={(e) => handleLinkClick(e, project.slug)}
                >
                  <div className="carousel-image-box">
                    <Image
                      src={project.cover}
                      alt={`${project.title} cover preview`}
                      fill
                      priority
                      draggable={false}
                      sizes="(max-width: 760px) 82vw, 360px"
                    />
                  </div>
                  <div className="carousel-card-caption">
                    <span className="caption-num">
                      {String(itemIdx + 1).padStart(2, "0")}
                    </span>
                    <div className="caption-text-block">
                      <h3 className="caption-title">{project.title}</h3>
                      <span className="caption-category">{project.category}</span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Carousel Bottom Controls & Slide Counter */}
      {totalCount > 1 && (
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
            <strong>{String(activeIndex + 1).padStart(2, "0")}</strong> /{" "}
            {String(totalCount).padStart(2, "0")}
          </span>
          <button
            type="button"
            className="carousel-arrow-btn"
            onClick={handleNext}
            aria-label="Next project"
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




