"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { Project } from "@/app/lib/data";

interface ProjectOverlayProps {
  project: Project;
  allProjects: Project[];
  onClose: () => void;
  onSelectProject: (slug: string) => void;
}

export function ProjectOverlay({
  project,
  allProjects,
  onClose,
  onSelectProject,
}: ProjectOverlayProps) {
  const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
  const totalProjects = allProjects.length;

  const handlePrev = useCallback(() => {
    if (totalProjects <= 1) return;
    const prevIndex = (currentIndex - 1 + totalProjects) % totalProjects;
    onSelectProject(allProjects[prevIndex].slug);
  }, [currentIndex, totalProjects, allProjects, onSelectProject]);

  const handleNext = useCallback(() => {
    if (totalProjects <= 1) return;
    const nextIndex = (currentIndex + 1) % totalProjects;
    onSelectProject(allProjects[nextIndex].slug);
  }, [currentIndex, totalProjects, allProjects, onSelectProject]);

  // Lock body scroll and handle keyboard shortcuts (ESC, Left, Right)
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, handlePrev, handleNext]);


  // Group gallery images into editorial layout blocks
  const gallery = project.gallery || [];
  const coverImage = project.cover;

  return (
    <motion.div
      className="project-overlay-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      onClick={onClose}
    >
      <motion.div
        className="project-overlay-panel"
        layoutId={`project-card-${project.slug}`}
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} project details`}
      >
        {/* Sticky Top Control Header Bar */}
        <header className="overlay-header-bar">
          <div className="overlay-header-left">
            <span className="overlay-num">
              {String(currentIndex + 1).padStart(2, "0")} / {String(totalProjects).padStart(2, "0")}
            </span>
            <span className="overlay-header-title">{project.title}</span>
            <span className="overlay-header-cat">{project.category}</span>
          </div>

          <div className="overlay-header-actions">
            {totalProjects > 1 && (
              <div className="overlay-nav-group" aria-label="Project Navigation">
                <button
                  type="button"
                  className="overlay-nav-btn"
                  onClick={handlePrev}
                  aria-label="Previous project"
                  title="Previous project (←)"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="overlay-nav-btn"
                  onClick={handleNext}
                  aria-label="Next project"
                  title="Next project (→)"
                >
                  →
                </button>
              </div>
            )}

            <button
              type="button"
              className="overlay-close-btn"
              onClick={onClose}
              aria-label="Close project panel"
              title="Close (ESC)"
            >
              <span>✕</span>
            </button>
          </div>
        </header>

        {/* Project Details Main Body */}
        <div className="overlay-content-body">
          {/* Title & Metadata Hero Section */}
          <div className="overlay-hero-meta">
            <div className="overlay-meta-top">
              <span className="eyebrow">{project.category}</span>
              <span className="overlay-year">{project.year}</span>
            </div>
            <h1 className="overlay-title">{project.title}</h1>
            <p className="overlay-summary">{project.summary}</p>
          </div>

          {/* Featured Cover Image */}
          {coverImage && (
            <div className="overlay-cover-wrapper">
              <Image
                src={coverImage}
                alt={`${project.title} cover`}
                width={1920}
                height={1080}
                priority
                sizes="(max-width: 900px) 100vw, 92vw"
                className="overlay-cover-img"
              />
            </div>
          )}

          {/* Editorial Gallery Grid */}
          {gallery.length > 0 && (
            <div className="overlay-gallery-grid" aria-label="Project Visual Gallery">
              {gallery.map((imgUrl, idx) => {
                // Editorial layout pattern logic:
                // idx % 5 === 0: full width spotlight
                // idx % 5 === 1 or 2: 2-column paired layout
                // idx % 5 === 3 or 4: asymmetrical 2-column grid
                let gridClass = "gallery-item-standard";
                if (idx % 5 === 0) {
                  gridClass = "gallery-item-fullwidth";
                } else if (idx % 5 === 1 || idx % 5 === 2) {
                  gridClass = "gallery-item-pair";
                } else {
                  gridClass = "gallery-item-asymmetric";
                }

                return (
                  <div key={`${imgUrl}-${idx}`} className={`overlay-gallery-item ${gridClass}`}>
                    <Image
                      src={imgUrl}
                      alt={`${project.title} visual ${idx + 1}`}
                      width={1600}
                      height={1200}
                      sizes="(max-width: 768px) 100vw, 48vw"
                      loading={idx < 4 ? "eager" : "lazy"}
                      className="overlay-gallery-img"
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom Footer Control Row */}
          <footer className="overlay-footer-row">
            <div className="overlay-footer-left">
              <button
                type="button"
                className="overlay-back-top-btn"
                onClick={() => {
                  const panel = document.querySelector(".project-overlay-panel");
                  if (panel) panel.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                ↑ BACK TO TOP
              </button>
            </div>
            {totalProjects > 1 && (
              <div className="overlay-footer-nav">
                <button type="button" className="overlay-footer-link" onClick={handlePrev}>
                  ← PREVIOUS PROJECT
                </button>
                <span className="overlay-footer-divider">/</span>
                <button type="button" className="overlay-footer-link" onClick={handleNext}>
                  NEXT PROJECT →
                </button>
              </div>
            )}
          </footer>
        </div>
      </motion.div>
    </motion.div>
  );
}
