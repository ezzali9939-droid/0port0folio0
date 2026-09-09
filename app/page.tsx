import Image from "next/image";
import Link from "next/link";
import { InteractiveHeroPortfolio } from "@/app/components/interactive-hero-portfolio";
import { InteractiveJourneyMarks } from "@/app/components/interactive-journey-marks";
import { InteractiveToolsSection } from "@/app/components/interactive-tools-section";
import { InteractiveZStage } from "@/app/components/interactive-z-stage";
import { ProjectCta } from "@/app/components/project-cta";
import { SharedBackgroundParticles } from "@/app/components/shared-background-particles";

export default function HomePage() {
  return (
    <main id="main-content" className="page-main-container">
      <SharedBackgroundParticles />
      <section className="hero hero-home shell">
      <div className="hero-composition">
        {/* Interactive Marks + Stationary Centered PORTFOLIO Typography (z-index: 1 & 2) */}
        <InteractiveHeroPortfolio />

        {/* Completely Fixed Static Portrait Anchor (z-index: 3, zero motion) */}
        <div className="home-portrait">
          <Image
            src="/assets/portraits/home-portrait-motion-transparent.webp"
            alt="Ezz Eldin, Graphic and Visual Designer"
            fill
            priority
            sizes="(max-width: 760px) 90vw, 54vw"
          />
        </div>
      </div>
      <div className="hero-intro">
        <p className="eyebrow">Ezz Eldin — Graphic &amp; Visual Designer</p>
        <p>Designs that speak. Stories that last.</p>
        <div className="inline-actions">
          <Link href="/work">Selected work ↗</Link>
          <Link href="/contact">Start a project ↗</Link>
        </div>
      </div>
      <span className="page-index">01 / Home</span>
    </section>

    <section className="journey-section shell" id="journey-section">
      <InteractiveJourneyMarks />

      {/* Header Row */}
      <div className="journey-header">
        <div className="journey-title-block">
          <span className="journey-num">02</span>
          <h2 className="journey-title">
            THE MARK BECOMES<br />THE JOURNEY
          </h2>
        </div>

        <div className="journey-shift-indicator" aria-hidden="true">
          <div className="shift-circle">
            <span className="blue-dot" />
          </div>
          <div className="shift-text">
            <span>MOVE</span>
            <span>TO SHIFT</span>
          </div>
        </div>
      </div>

      {/* Main Stage: Left Timeline + Exact Stationary Centered Enlarged Z + Official EZ Logo */}
      <div className="journey-stage">
        <div className="journey-timeline">
          <div className="timeline-stage stage-top">
            <span className="stage-year">2018 /</span>
            <strong className="stage-name">VISUAL BEGINNING</strong>
            <p className="stage-desc">Branding, print and the foundations of visual storytelling.</p>
          </div>

          <div className="timeline-stage stage-middle">
            <span className="stage-year">2022 /</span>
            <strong className="stage-name">DIGITAL EXPANSION</strong>
            <p className="stage-desc">UI/UX, websites and interfaces built around real behavior.</p>
          </div>

          <div className="timeline-stage stage-bottom">
            <span className="stage-year">NOW /</span>
            <strong className="stage-name">CONNECTED PRACTICE</strong>
            <p className="stage-desc">Brands, systems, campaigns and AI-assisted visuals working as one.</p>
          </div>
        </div>

        {/* Stationary Centered Wrapper & Interactive Motion Stage */}
        <InteractiveZStage />
      </div>

      {/* Bottom Statement & Links */}
      <div className="journey-footer">
        <p className="journey-statement">
          THE MARK ISN&apos;T DECORATION.<br />IT&apos;S THE SYSTEM BEHIND THE WORK.
        </p>
        <div className="journey-links">
          <Link href="/about" className="journey-link">EXPLORE MY JOURNEY ↗</Link>
          <Link href="/work" className="journey-link">VIEW SELECTED WORK ↗</Link>
        </div>
      </div>
    </section>

    {/* Section 03 / TOOLS Redesign */}
    <section className="tools-section-redesign shell" id="tools-section">
      <div className="tools-header-row">
        <div className="tools-title-block">
          <span className="tools-num">03</span>
          <h2 className="tools-title">
            THE TOOLS CHANGE.<br />THE STANDARD DOESN&apos;T.
          </h2>
        </div>
      </div>

      <InteractiveToolsSection />

      <div className="tools-bottom-caption">
        <p>Tools are temporary.</p>
        <p>Intent and refine is the real craft.</p>
      </div>
    </section>

    <ProjectCta />
    </main>
  );
}
