import type { Metadata } from "next";
import Image from "next/image";
import { ProjectCta } from "@/app/components/project-cta";
import { Reveal } from "@/app/components/reveal";
import { SharedBackgroundParticles } from "@/app/components/shared-background-particles";

export const metadata: Metadata = { title: "About", description: "The practice, path and design thinking behind Ezz Eldin's work." };

export default function AboutPage() {
  return (
    <main id="main-content" className="about-page-main">
      {/* Single Shared Background Particle Layer spanning full page height */}
      <SharedBackgroundParticles />

      {/* 01 / Hero Section */}
      <section className="hero hero-about shell">
        <div className="about-portrait">
          <Image
            src="/assets/portraits/about-portrait-motion-transparent.webp"
            alt="Portrait of Ezz Eldin"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 65vw"
          />
        </div>
        <div className="about-intro">
          <div className="about-title">ABOUT</div>
          <p className="eyebrow">01 / About</p>
          <h1>
            Curiosity shapes how I see.<br />
            Craft shapes what I create.
          </h1>
          <p>
            I&apos;m Ezz Eldin, a Graphic &amp; Visual Designer based in Alexandria. I build purposeful identities and digital experiences where clarity meets character.
          </p>
          <p className="micro-line">Designing since 2018 / UI/UX since 2022 / Alexandria, Egypt</p>
        </div>
      </section>

      {/* 02 / THE PRACTICE Section - Compact 2-Column Layout */}
      <section className="section shell practice-section-redesign">
        <div className="practice-grid">
          {/* Left Column: Copy & Heading */}
          <Reveal className="practice-copy">
            <p className="eyebrow">02 / THE PRACTICE</p>
            <h2 className="practice-heading">
              DIFFERENT<br />
              OUTPUTS.<br />
              ONE WAY OF<br />
              THINKING.
            </h2>
            <p>
              My work moves between brand identities, campaigns, print, digital experiences and UI/UX. I don’t treat them as separate disciplines. Each one is another way to make an idea clearer, more useful and easier to remember.
            </p>
            <p>
              The medium changes. The thinking stays grounded in people, meaning and systems.
            </p>
          </Reveal>

          {/* Right Column: Ribbon Artwork & 5 Top Category Labels */}
          <Reveal className="practice-ribbon-wrapper">
            {/* 5 Category Labels Positioned Directly Above Ribbon Panels */}
            <div className="ribbon-labels-top" aria-label="Practice Categories">
              <div className="ribbon-label-item label-identity" style={{ left: "17.5%" }}>
                <span>IDENTITY</span>
                <span className="ribbon-tick" aria-hidden="true" />
              </div>
              <div className="ribbon-label-item label-campaigns" style={{ left: "32%" }}>
                <span>CAMPAIGNS</span>
                <span className="ribbon-tick" aria-hidden="true" />
              </div>
              <div className="ribbon-label-item label-print" style={{ left: "47%" }}>
                <span>PRINT</span>
                <span className="ribbon-tick" aria-hidden="true" />
              </div>
              <div className="ribbon-label-item label-digital" style={{ left: "62.5%" }}>
                <span>DIGITAL</span>
                <span className="ribbon-tick" aria-hidden="true" />
              </div>
              <div className="ribbon-label-item label-uiux" style={{ left: "79.5%" }}>
                <span>UI/UX</span>
                <span className="ribbon-tick" aria-hidden="true" />
              </div>
            </div>

            {/* Ribbon Artwork Stage with Broad Ground & Contact Shadows */}
            <div className="ribbon-artwork-container">
              <div className="ribbon-contact-shadow" aria-hidden="true" />
              <div className="ribbon-ground-shadow" aria-hidden="true" />
              <Image
                src="/assets/page-assets/about/7c419ec8-5184-4e57-86a8-fd8fee69323a.png"
                alt="A ribbon mapping identity, campaigns, print, digital and UI/UX"
                width={1200}
                height={520}
                sizes="(max-width: 760px) 100vw, 55vw"
                priority
                className="practice-ribbon-image-static"
              />
            </div>
          </Reveal>
        </div>

        {/* Thin Divider & Sub-Bar */}
        <div className="practice-sub-bar">
          <div className="practice-sub-line" aria-hidden="true" />
          <div className="practice-sub-row">
            <span>IDENTITY / CAMPAIGNS / PRINT / DIGITAL / UI/UX</span>
            <span>ONE PRACTICE / THREE LENSES</span>
          </div>
        </div>
      </section>

      {/* A PERSONAL NOTE Section - Centered Non-Italic Hierarchy */}
      <section className="personal-note-section-redesign shell">
        <Reveal className="personal-note-content">
          <p className="eyebrow">A PERSONAL NOTE</p>
          <h2 className="personal-note-heading">
            <span className="personal-note-line1">MY PATH WASN’T STRAIGHT, BUT </span>
            <span className="personal-note-line2">None of it was wasted.</span>
          </h2>
          <p className="personal-note-body">
            I’m Ezz Eldin, an Alexandria-based Graphic &amp; Visual Designer. Tourism taught me to read people. Graphic design taught me to shape meaning. UI/UX taught me to build systems. I carry all three into every project.
          </p>
          <p className="personal-note-closing">
            UNDERSTAND FIRST. CREATE WITH PURPOSE. BUILD TO LAST.
          </p>
        </Reveal>
      </section>

      {/* 03 / BUILT IN LAYERS Section - Rebuilt Layout */}
      <section className="layers-section-redesign shell">
        <div className="layers-grid">
          {/* Left Column: 3D Artwork + 3 Layer Annotations */}
          <Reveal className="layers-artwork-wrapper">
            <div className="layers-image-container">
              <Image
                src="/assets/page-assets/about/design-thinking-layers.webp"
                alt="Three physical layers representing understand, create and systemize"
                width={800}
                height={700}
                sizes="(max-width: 760px) 100vw, 45vw"
                priority
                className="layers-image-static"
              />
            </div>

            {/* 3 Layer Annotations & Connector Lines */}
            <div className="layer-annotations-container" aria-label="Layer Specifications">
              <div className="layer-annotation-item">
                <span className="annotation-line" aria-hidden="true" />
                <span className="annotation-text">01 / UNDERSTAND</span>
              </div>
              <div className="layer-annotation-item">
                <span className="annotation-line" aria-hidden="true" />
                <span className="annotation-text">02 / CREATE</span>
              </div>
              <div className="layer-annotation-item">
                <span className="annotation-line" aria-hidden="true" />
                <span className="annotation-text">03 / SYSTEMIZE</span>
              </div>
            </div>
          </Reveal>

          {/* Right Column: Copy & Mixed Heading */}
          <Reveal className="layers-copy">
            <p className="eyebrow">03 / BUILT IN LAYERS</p>
            <h2 className="layers-heading">
              <span>GOOD DESIGN ISN’T A STYLE.</span><br />
              <span className="signature-accent layers-subheading">It&apos;s a way of thinking.</span>
            </h2>
            <p className="layers-body">
              Every project moves through three connected layers — understanding people, shaping meaning and building a system that can last.
            </p>
          </Reveal>
        </div>
      </section>

      <ProjectCta />
    </main>
  );
}



