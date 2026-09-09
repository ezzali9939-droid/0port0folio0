import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/app/components/contact-form";
import { ProjectCta } from "@/app/components/project-cta";
import { Reveal } from "@/app/components/reveal";
import { contact } from "@/app/lib/data";

import { SharedBackgroundParticles } from "@/app/components/shared-background-particles";

export const metadata: Metadata = { title: "Contact", description: "Start a branding, campaign, print or digital design project with Ezz Eldin." };
export default function ContactPage() {
  return (
    <main id="main-content" className="contact-page-main">
      <SharedBackgroundParticles />
      <section className="contact-hero shell">
        <div className="contact-hero-composition">
          <div className="contact-left-content">
            <div className="contact-wordmark-above">
              <span className="contact-giant-heading">CONTACT</span>
            </div>
            <div className="contact-copy-below">
              <p className="eyebrow">01 / Contact</p>
              <h1>
                Have an idea? Let&apos;s make it <span className="signature-accent">matter.</span>
              </h1>
              <p>Tell me what you&apos;re building. I&apos;ll reply with clarity, direction and the right next steps.</p>
              <div className="contact-links">
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <a href={contact.whatsapp}>WhatsApp</a>
                <span>{contact.location}</span>
              </div>
            </div>
          </div>

          <div className="circuit-form">
            <Image
              src="/assets/page-assets/contact/contact-ring-artwork-v3.png"
              alt="Circular artwork framing contact form"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 95vw"
              aria-hidden="true"
            />
            <ContactForm />
          </div>
        </div>
      </section>
      <section className="section what-happens-next-section">
        <div className="shell">
          <Reveal className="what-happens-next-content">
            <p className="eyebrow">02 / What happens next</p>
            <h2 className="what-happens-next-headline">
              YOUR MESSAGE DOESN&apos;T DISAPPEAR.<br />
              IT BECOMES direction.
            </h2>
            <p className="what-happens-next-desc">
              A clear response, focused questions and a brief built around what the project actually needs.
            </p>
          </Reveal>
        </div>
        <Reveal className="what-happens-next-fullwidth-wrapper">
          <div className="what-happens-next-visual">
            <Image
              src="/assets/page-assets/contact/what-happens-next-fullwidth.png"
              alt="Visual pipeline asset: Your message becomes direction"
              width={2066}
              height={761}
              priority
              sizes="100vw"
            />
          </div>
        </Reveal>
      </section>
      <section className="section strong-start-section">
        <div className="shell">
          <Reveal className="strong-start-content">
            <p className="eyebrow">03 / A strong start</p>
            <h2 className="strong-start-headline">
              CLARITY FIRST.<br />
              THEN WE CREATE.
            </h2>
            <p className="strong-start-desc">
              Four decisions turn an idea into a focused starting point: audience, goal, scope and deadline.
              <br />
              No perfect brief yet? Start with the problem. We&apos;ll shape the rest together.
            </p>
          </Reveal>
        </div>
        <Reveal className="strong-start-fullwidth-wrapper">
          <div className="strong-start-visual">
            <Image
              src="/assets/page-assets/contact/a-strong-start-3d.png"
              alt="Calibration frame 3D asset representing audience, goal, scope and deadline"
              width={2066}
              height={761}
              priority
              sizes="100vw"
            />
          </div>
        </Reveal>
      </section>
      <ProjectCta />
    </main>
  );
}
