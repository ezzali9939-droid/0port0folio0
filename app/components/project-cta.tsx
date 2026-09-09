import Link from "next/link";
import { contact } from "@/app/lib/data";
import { MetallicFrame } from "@/app/components/metallic-frame";

export function ProjectCta() {
  return (
    <section className="project-cta">
      <div className="shell cta-grid">
        <MetallicFrame />
        <div className="cta-copy">
          <p className="eyebrow">Let&apos;s connect</p>
          <h2>
            I DON&apos;T DECORATE IDEAS.<br />
            I BUILD THE SYSTEM THAT MAKES THEM<br />
            <span className="signature-accent">Impossible to ignore.</span>
          </h2>
          <Link className="button-light" href="/contact">
            Start a project ↗
          </Link>
          <address>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <span>{contact.location}</span>
            <span className="availability dark">
              <i />
              {contact.availability}
            </span>
          </address>
        </div>
      </div>
    </section>
  );
}
