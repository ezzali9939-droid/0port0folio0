import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/cormorant";
import "@fontsource/alex-brush";
import "@fontsource/sacramento";
import "./globals.css";
import { PageChoreography } from "@/app/components/page-choreography";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alex+Brush&family=Great+Vibes&family=Sacramento&display=swap"
          rel="stylesheet"
        />
      </head>
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
