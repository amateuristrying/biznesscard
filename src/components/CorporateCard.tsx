"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardFront from "./CardFront";
import CardBack from "./CardBack";
import { themes } from "./ThemeDock";
import FaultyTerminal from "./FaultyTerminal";
import gsap from "gsap";

export default function CorporateCard() {
  const [rotationY, setRotationY] = useState(0);
  const [isCVOpen, setIsCVOpen] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const lastFlipTime = useRef<number>(0);
  const COOLDOWN = 800; // ms, matches transition duration

  const [activeTheme, setActiveTheme] = useState<"classic" | "cyber">("classic");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const target = themes[activeTheme];

    // GSAP color interpolation for CSS custom properties
    gsap.to(container, {
      "--theme-bg": activeTheme === "cyber" ? "#050505" : target.bg,
      "--theme-primary": target.primary,
      "--theme-secondary": target.secondary,
      "--theme-shadow": target.shadow,
      "--theme-outline": target.outline,
      "--theme-text": target.text,
      "--theme-border": activeTheme === "cyber" ? "rgba(255, 212, 0, 0.18)" : target.border,
      "--theme-card-bg": activeTheme === "cyber" ? "#1a1a1a" : "#DAD1BF",
      duration: 1.0,
      ease: "power2.out"
    });
  }, [activeTheme]);


  // Click handler to toggle flip, avoiding triggers when clicking links or buttons or when CV is open
  const handleToggleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCVOpen) return;
    const target = e.target as HTMLElement;
    if (target.closest("a") || target.closest("button")) {
      return;
    }
    const now = Date.now();
    if (now - lastFlipTime.current < COOLDOWN) return;

    setRotationY((prev) => prev + 180);
    lastFlipTime.current = now;
  };

  // Wheel handler to detect scroll direction
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isCVOpen) return;
    // Prevent accidental rapid triggering
    if (Math.abs(e.deltaY) < 10) return;

    const now = Date.now();
    if (now - lastFlipTime.current < COOLDOWN) return;

    if (e.deltaY > 0) {
      // Scroll down -> spin forward
      setRotationY((prev) => prev + 180);
      lastFlipTime.current = now;
    } else if (e.deltaY < 0) {
      // Scroll up -> spin backward
      setRotationY((prev) => prev - 180);
      lastFlipTime.current = now;
    }
  };

  // Touch handlers to detect swipe up/down
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isCVOpen) return;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isCVOpen || touchStartY.current === null) return;

    const currentY = e.touches[0].clientY;
    const diffY = touchStartY.current - currentY; // positive means swiped up (scroll down)

    // Swipe threshold to trigger flip
    if (Math.abs(diffY) > 50) {
      const now = Date.now();
      if (now - lastFlipTime.current >= COOLDOWN) {
        if (diffY > 0) {
          // Swipe up -> Scroll down -> spin forward
          setRotationY((prev) => prev + 180);
        } else {
          // Swipe down -> Scroll up -> spin backward
          setRotationY((prev) => prev - 180);
        }
        lastFlipTime.current = now;
      }
      // Reset after triggering to avoid multiple toggles during a single swipe
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  // Calculate if the back is showing (rotationY is an odd multiple of 180 degrees)
  const isBack = Math.round(rotationY / 180) % 2 !== 0;

  return (
    // Viewport-locked container (no actual browser scrollbar needed)
    <div 
      ref={containerRef}
      className="relative w-screen h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] overflow-hidden flex items-center justify-center cursor-pointer"
      onClick={handleToggleFlip}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: "2500px", ...(themes[activeTheme] as React.CSSProperties) }}
    >
      {/* Background theme elements with AnimatePresence */}
      <AnimatePresence>
        {activeTheme === "cyber" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            className="absolute inset-0 z-0 pointer-events-none"
          >
            {/* Layer 1: FaultyTerminal Animation */}
            <div className="absolute inset-0">
              <FaultyTerminal
                scale={1.6}
                gridMul={[2, 1]}
                digitSize={1.25}
                timeScale={1}
                pause={false}
                scanlineIntensity={0.7}
                glitchAmount={0.6}
                flickerAmount={0.4}
                noiseAmp={0.5}
                chromaticAberration={0}
                dither={0}
                curvature={0}
                tint="#FFD400"
                mouseReact={true}
                mouseStrength={0.25}
                pageLoadAnimation={false}
                brightness={0.18}
              />
            </div>
            {/* Layer 2: Black Translucent Overlay */}
            <div 
              className="absolute inset-0 z-[1]"
              style={{
                background: "rgba(0, 0, 0, 0.82)",
                backdropFilter: "blur(1px)",
                WebkitBackdropFilter: "blur(1px)"
              }}
            />
            {/* Layer 3: Center ambient glow to pop the card */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,212,0,0.05)_0%,transparent_60%)] z-[2]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* The 3D Card wrapper that rotates based on state */}
      <motion.div
        className="relative w-full h-full transform-3d z-10"
        animate={{ rotateY: rotationY }}
        transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }} // smooth cubic-bezier transition
      >
        <CardFront 
          isVisible={!isBack} 
          activeTheme={activeTheme} 
          onChangeTheme={setActiveTheme} 
        />
        <CardBack isVisible={isBack} onOpenCV={() => setIsCVOpen(true)} activeTheme={activeTheme} />
      </motion.div>

      {/* CV Modal dialog overlay */}
      <AnimatePresence>
        {isCVOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-10 cursor-default"
            onClick={() => setIsCVOpen(false)} // close modal on backdrop click
          >
            <motion.div
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="bg-[#D8D1C1] border-2 border-black w-full max-w-4xl h-[85vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()} // prevent modal close when clicking inside
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b-2 border-black/10 bg-black/5 select-none">
                <span className="font-mono text-sm md:text-base font-bold text-black tracking-tight">
                  Abhiroop_CV.pdf
                </span>
                <div className="flex items-center gap-3">
                  {/* Connect Button (Paper Plane) */}
                  <a 
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=abhiroophiremath@gmail.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-black rounded-full hover:bg-black hover:text-[#D8D1C1] transition-all duration-300 text-black font-mono text-xs md:text-sm font-semibold cursor-pointer z-10"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                    <span>Connect</span>
                  </a>

                  {/* Close Button (Cross) */}
                  <button 
                    onClick={() => setIsCVOpen(false)} 
                    className="p-2 border border-black/10 rounded-full hover:bg-black/5 hover:border-black/30 transition-all duration-300 text-black cursor-pointer"
                    aria-label="Close CV"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* PDF Viewer Body */}
              <div className="flex-1 w-full h-full relative bg-white">
                <iframe 
                  src="/Abhiroop_CV.pdf#toolbar=0" 
                  className="w-full h-full border-none"
                  title="Abhiroop CV PDF"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
