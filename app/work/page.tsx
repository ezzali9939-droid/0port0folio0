import type { Metadata } from "next";
import Image from "next/image";
import { ProjectCta } from "@/app/components/project-cta";
import { Reveal } from "@/app/components/reveal";
import { ProjectCarousel } from "@/app/components/project-carousel";
import { SharedBackgroundParticles } from "@/app/components/shared-background-particles";
import { projects } from "@/app/lib/data";
import { SubtleBackgroundOrbits } from "@/app/components/subtle-background-orbits";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected brand systems, campaigns, digital experiences and print work by Ezz Eldin.",
};

export default function WorkPage() {
  return (
    <main id="main-content" className="work-page-main">
      <SharedBackgroundParticles />
      {/* 01 / WORK Hero Section */}
      <section className="hero hero-work shell">
        <div className="work-hero-asset">
          <Image
            src="/assets/page-assets/work/ChatGPT Image Sep 8, 2026, 03_33_34 PM.png"
            alt="A cluster of selected project applications"
            fill
            priority
            sizes="(max-width: 900px) 100vw, 66vw"
          />
        </div>
        <div className="work-intro">
          <div className="work-title">WORK</div>
          <p className="eyebrow">01 / Work</p>
          <h1>
            Selected work, built with <span className="signature-accent">purpose.</span>
          </h1>
          <p>
            Identity, campaigns, interfaces and physical experiences shaped to communicate clearly and perform.
          </p>
        </div>
      </section>

      {/* 02 / SELECTED WORK Section - Horizontal Project Carousel */}
      <section className="section shell project-carousel-section">
        <div className="section-heading">
          <p className="eyebrow">02 / Selected work</p>
          <h2>
            <span>WORK BUILT TO LIVE</span>
            <span>BEYOND THE SCREEN.</span>
          </h2>
        </div>
        <ProjectCarousel projects={projects} />
      </section>

      {/* 03 / How the work begins Section */}
      <section className="section shell process-section-stacked">
        <Reveal className="process-stacked-copy">
          <p className="eyebrow">03 / How the work begins</p>
          <h2>
            THE WORK STARTS<br />
            BEFORE THE FIRST PIXEL.
          </h2>
          <p className="process-stacked-desc">
            Before the layout, there is a question. Before the polish, there is a direction.
          </p>
        </Reveal>
        <Reveal className="process-stacked-artwork">
          <Image
            src="/assets/page-assets/work/ChatGPT Image Sep 8, 2026, 02_54_21 PM.png"
            alt="Five connected stages from reception to execution"
            width={1672}
            height={770}
            sizes="(max-width: 760px) 100vw, 1180px"
            priority
          />
        </Reveal>
      </section>

      {/* 04 / The standard Section */}
      <section className="section shell split-section work-standard-section">
        <Reveal className="section-copy">
          <p className="eyebrow">04 / The standard</p>
          <h2 className="hero-standard-headline">
            <span>GOOD-LOOKING ISN&apos;T</span>
            <span>THE FINISH LINE.</span>
          </h2>
          <p>
            A strong project needs more than polish. It needs clarity, consistency, scalability and impact.
          </p>
        </Reveal>
        <Reveal className="visual-panel gyro-panel">
          <SubtleBackgroundOrbits />
          <Image
            src="/assets/page-assets/work/ChatGPT Image Sep 8, 2026, 04_34_56 PM.png"
            alt="A metallic orbital 3D element representing design standards"
            width={800}
            height={800}
            sizes="(max-width: 900px) 100vw, 48vw"
            priority
            className="gyro-standard-asset"
          />
        </Reveal>
      </section>

      <ProjectCta />
    </main>
  );
}
