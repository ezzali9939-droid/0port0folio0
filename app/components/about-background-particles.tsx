"use client";

import { SharedBackgroundParticles } from "./shared-background-particles";

export function AboutBackgroundParticles({ className = "" }: { className?: string }) {
  return <SharedBackgroundParticles className={className} />;
}
