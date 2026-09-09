import Image from "next/image";
import Link from "next/link";
import { contact } from "@/app/lib/data";

export function SiteFooter() {
  return <footer className="site-footer"><div className="shell footer-row"><Image src="/assets/brand/logo/ez-wordmark-white.webp" alt="Ezz Eldin" width={128} height={40} /><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/work">Work</Link><Link href="/contact">Contact</Link></nav><nav aria-label="Social links"><a href={contact.instagram} target="_blank" rel="noreferrer">Instagram</a><a href={contact.facebook} target="_blank" rel="noreferrer">Facebook</a><a href={contact.linkedin} target="_blank" rel="noreferrer">LinkedIn</a><a href={contact.whatsapp} target="_blank" rel="noreferrer">WhatsApp</a></nav></div><p className="copyright">© 2026 Ezz Eldin. All rights reserved.</p></footer>;
}
