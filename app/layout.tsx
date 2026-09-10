import type { Metadata, Viewport } from "next";
import { Great_Vibes } from "next/font/google";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant";
import "@fontsource/alex-brush";
import "@fontsource/sacramento";
import "./globals.css";
import { PageChoreography } from "@/app/components/page-choreography";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-great-vibes",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ezzali.com"),
  title: { default: "Ezz Eldin — Graphic & Visual Designer", template: "%s | Ezz Eldin" },
  description: "Purposeful identities, campaigns and digital experiences by Ezz Eldin, a Graphic & Visual Designer based in Alexandria, Egypt.",
  openGraph: { title: "Ezz Eldin — Graphic & Visual Designer", description: "Designs that speak. Stories that last.", type: "website", images: ["/assets/portraits/home-portrait-motion-transparent.webp"] },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/assets/brand/logo/favicon-512.webp",
    shortcut: "/assets/brand/logo/favicon-512.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={greatVibes.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <PageChoreography />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}

