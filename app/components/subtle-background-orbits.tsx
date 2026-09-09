"use client";

import { useEffect, useRef } from "react";

export function SubtleBackgroundOrbits() {
  const ring1Ref = useRef<HTMLDivElement>(null);
  const ring2Ref = useRef<HTMLDivElement>(null);
  const ring3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;

      // Ring 1: Clockwise rotation over 24s
      const angle1 = ((elapsed % 24) / 24) * 360;
      if (ring1Ref.current) {
        ring1Ref.current.style.transform = `rotateX(58deg) rotateY(-14deg) rotateZ(12deg) rotateZ(${angle1.toFixed(2)}deg)`;
      }

      // Ring 2: Counter-clockwise rotation over 30s
      const angle2 = -((elapsed % 30) / 30) * 360;
      if (ring2Ref.current) {
        ring2Ref.current.style.transform = `rotateX(-48deg) rotateY(28deg) rotateZ(-32deg) rotateZ(${angle2.toFixed(2)}deg)`;
      }

      // Ring 3: Clockwise rotation over 36s
      const angle3 = ((elapsed % 36) / 36) * 360;
      if (ring3Ref.current) {
        ring3Ref.current.style.transform = `rotateX(36deg) rotateY(40deg) rotateZ(-65deg) rotateZ(${angle3.toFixed(2)}deg)`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="subtle-bg-orbits-container" aria-hidden="true">
      {/* Background Orbital Line 1 */}
      <div ref={ring1Ref} className="bg-orbit-ring ring-1">
        <div className="orbit-circle circle-1">
          <span className="orbit-node" />
        </div>
      </div>

      {/* Background Orbital Line 2 */}
      <div ref={ring2Ref} className="bg-orbit-ring ring-2">
        <div className="orbit-circle circle-2">
          <span className="orbit-node" />
        </div>
      </div>

      {/* Background Orbital Line 3 */}
      <div ref={ring3Ref} className="bg-orbit-ring ring-3">
        <div className="orbit-circle circle-3">
          <span className="orbit-node" />
        </div>
      </div>
    </div>
  );
}
