"use client";

import React, { useLayoutEffect, useState } from "react";

// The card is designed against a fixed canvas width. Browser zoom changes how
// many CSS pixels the viewport reports (60% zoom hands us a ~1.67x wider
// viewport), so scaling the canvas by viewport/design width cancels the zoom
// out entirely: the layout lands at the same physical size at 50%, 100% or 150%.
const DESIGN_WIDTH = 1440;

// Below this the responsive mobile layout takes over and is left alone.
const MOBILE_BREAKPOINT = 768;

interface Box {
  scale: number;
  height: number;
}

export default function ZoomLock({ children }: { children: React.ReactNode }) {
  const [box, setBox] = useState<Box | null>(null);
  const [bypass, setBypass] = useState(false);

  useLayoutEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (vw < MOBILE_BREAKPOINT) {
        setBypass(true);
        return;
      }

      const scale = vw / DESIGN_WIDTH;
      setBypass(false);
      // Height is divided back out so the scaled box still covers the viewport
      // exactly, keeping the theme backgrounds full-bleed.
      setBox({ scale, height: vh / scale });
    };

    measure();
    // Browsers fire resize on zoom change, so this re-locks as the user zooms.
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Mobile keeps its own responsive layout, but still needs a definite height
  // for the card's h-full to resolve against.
  if (bypass) return <div className="w-screen h-screen overflow-hidden">{children}</div>;

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ opacity: box ? 1 : 0 }}>
      <div
        style={{
          width: DESIGN_WIDTH,
          height: box ? box.height : "100%",
          transform: `scale(${box ? box.scale : 1})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
