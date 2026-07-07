"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProjectSocialBar from "./ProjectSocialBar";

// Configurable socials object
const socials = {
  x: "https://x.com",
  behance: "https://behance.net",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  gmail: "mailto:abhiroop@example.com"
};

interface Project {
  id: string;
  src: string;
  alt: string;
  title: string;
  desc: string;
}

const projects: Project[] = [
  { 
    id: "a", 
    src: "/project posters/a.png", 
    alt: "Poster A", 
    title: "99VCA",
    desc: "Building calm, open software that empowers people instead of overwhelming them."
  },
  { 
    id: "b", 
    src: "/project posters/b.png", 
    alt: "Poster B", 
    title: "EZCAT",
    desc: "A modern, lightning-fast digital asset cataloging and publishing system."
  },
  { 
    id: "c", 
    src: "/project posters/c.png", 
    alt: "Poster C", 
    title: "Internal Tracking Tools",
    desc: "Tailored, reliable monitoring tools built for internal logistics and asset pipelines."
  },
  { 
    id: "d", 
    src: "/project posters/d.png", 
    alt: "Poster D", 
    title: "Sandhya",
    desc: "A clinically-informed wisdom companion blending psychology and philosophy."
  },
  { 
    id: "e", 
    src: "/project posters/e.png", 
    alt: "Poster E", 
    title: "FourSets",
    desc: "A minimalist, hyper-focused productivity and workout sequencing dashboard."
  },
  { 
    id: "f", 
    src: "/project posters/f.png", 
    alt: "Poster F", 
    title: "Raayo",
    desc: "An architectural, high-end platform built for high-performance vibe coding in prod."
  }
];

interface CardBackProps {
  isVisible: boolean;
  onOpenCV: () => void;
}

export default function CardBack({ isVisible, onOpenCV }: CardBackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const lastScrollTime = useRef<number>(0);
  const SCROLL_COOLDOWN = 300; // ms to prevent rapid skipping

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen to left and right arrow keys globally when card back is visible
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
        setTappedIndex(null);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % projects.length);
        setTappedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
    setTappedIndex(null);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % projects.length);
    setTappedIndex(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // If the scroll is predominantly horizontal
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 8) {
      e.stopPropagation();

      const now = Date.now();
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;

      if (e.deltaX > 0) {
        // Scroll right -> next project
        setActiveIndex((prev) => (prev + 1) % projects.length);
        lastScrollTime.current = now;
      } else if (e.deltaX < 0) {
        // Scroll left -> prev project
        setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
        lastScrollTime.current = now;
      }
      setTappedIndex(null);
    }
  };

  // Touch handlers for swiping carousel items (horizontal-only)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = touchStartX.current - currentX;
    const diffY = touchStartY.current - currentY;

    // Check if swipe is predominantly horizontal
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Intercept horizontal swipes to cycle projects, preventing card flip
      e.stopPropagation();

      if (Math.abs(diffX) > 40) {
        if (diffX > 0) {
          // Swipe left -> next project
          setActiveIndex((prev) => (prev + 1) % projects.length);
        } else {
          // Swipe right -> prev project
          setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
        }
        touchStartX.current = null;
        touchStartY.current = null;
        setTappedIndex(null);
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div 
      className="absolute inset-0 w-full h-full bg-[#D8D1C1] border-2 border-black flex flex-col justify-between p-10 md:p-20 backface-hidden z-10"
      style={{ transform: "rotateY(180deg)" }}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={() => setTappedIndex(null)}
    >
      {/* Center Section: Projects Area */}
      <div className="flex flex-col items-center justify-center w-full my-auto py-4 relative transform-3d">
        <h3 className="text-4xl md:text-6xl font-bold tracking-tight text-black mb-8 md:mb-12 text-center">
          Projects
        </h3>

        {/* Outer container with arrows and sliding track */}
        <div className="relative flex items-center justify-center w-full max-w-6xl h-[330px] md:h-[420px] overflow-visible px-12 md:px-20 transform-3d">
          
          {/* Navigation Arrow Left */}
          <button
            onClick={handlePrev}
            className="absolute left-0 md:left-4 z-30 w-12 h-12 flex items-center justify-center rounded-full border border-black/10 hover:border-black/30 bg-[#D8D1C1]/40 backdrop-blur-sm hover:bg-black/5 transition-all duration-300 group cursor-pointer"
            aria-label="Previous Project"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-6 h-6 text-black/60 group-hover:text-black group-hover:-translate-x-0.5 transition-all"
            >
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* 3D Sliding Cards Window */}
          <div className="relative flex items-center justify-center w-full h-full overflow-visible transform-3d">
            {projects.map((project, index) => {
              const N = projects.length;
              let offset = index - activeIndex;

              // Infinite wrapping distance calculations
              if (offset > N / 2) {
                offset -= N;
              } else if (offset < -N / 2) {
                offset += N;
              }

              const absOffset = Math.abs(offset);

              // Don't render cards that are far away from active index
              if (absOffset > 2) return null;

              // Spacing math for overlap coverflow layout
              const spacing = isMobile ? 120 : 269;
              const x = offset * spacing;
              const scale = 1 - absOffset * 0.15;
              const rotateY = offset * -20;
              const opacity = absOffset === 0 ? 1 : absOffset === 1 ? 0.2 : 0.05;
              const zIndex = 10 - absOffset;

              const isRevealed = offset === 0 && (hoveredIndex === index || tappedIndex === index);

              return (
                <motion.div
                  key={project.id}
                  style={{
                    position: "absolute",
                    width: isMobile ? 180 : 255,
                    height: isMobile ? 260 : 365,
                    transformStyle: "preserve-3d"
                  }}
                  animate={{
                    x,
                    scale,
                    rotateY,
                    opacity,
                    zIndex,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 26,
                  }}
                  onClick={(e) => {
                    if (offset !== 0) {
                      e.stopPropagation();
                      setActiveIndex(index);
                      setTappedIndex(null);
                    } else {
                      // Tap active card to toggle overlay reveal
                      e.stopPropagation();
                      setTappedIndex((prev) => (prev === index ? null : index));
                    }
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  tabIndex={0}
                  className={`border border-black/[0.12] rounded-[32px] overflow-hidden relative shadow-[0_8px_30px_rgba(0,0,0,0.02)] select-none transition-shadow duration-300 outline-none ${
                    offset === 0 
                      ? "ring-1 ring-black/5" 
                      : "cursor-pointer"
                  }`}
                >
                  {/* Bottom Layer: The Poster Image */}
                  <img
                    src={project.src}
                    alt={project.alt}
                    className="w-full h-full object-cover pointer-events-none select-none"
                  />

                  {/* Top Layer: Frosted Glass Overlay */}
                  <div 
                    className="absolute inset-0 bg-white/[0.08] backdrop-blur-[20px] backdrop-saturate-[1.2] border border-white/20 rounded-[31px] flex flex-col items-center justify-center p-6 text-center select-none z-10 transition-opacity duration-[2000ms] ease-in-out"
                    style={{
                      opacity: isRevealed ? 0 : 1.0,
                      pointerEvents: isRevealed ? "none" : "auto"
                    }}
                  >
                    {/* Subtle Noise Texture */}
                    <div 
                      className="absolute inset-0 opacity-[0.03] pointer-events-none rounded-[31px]" 
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                      }}
                    />

                    {/* Content Area */}
                    <div className="flex flex-col items-center justify-center w-full h-full relative z-20">
                      {/* Product Name */}
                      <h4 className="font-pixel text-4xl md:text-5xl text-black tracking-wider uppercase">
                        {project.title}
                      </h4>

                      {/* Small Divider */}
                      <div className="w-8 h-[1px] bg-black/40 my-4" />

                      {/* Monospace Description */}
                      <p className="font-mono-desc text-[11px] md:text-xs text-black/85 leading-relaxed max-w-[90%] font-medium">
                        {project.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Arrow Right */}
          <button
            onClick={handleNext}
            className="absolute right-0 md:right-4 z-30 w-12 h-12 flex items-center justify-center rounded-full border border-black/10 hover:border-black/30 bg-[#D8D1C1]/40 backdrop-blur-sm hover:bg-black/5 transition-all duration-300 group cursor-pointer"
            aria-label="Next Project"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="w-6 h-6 text-black/60 group-hover:text-black group-hover:translate-x-0.5 transition-all"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-center items-end w-full mt-auto relative">
        {/* Centered Social Outline Icons (GSAP Animated Pill Navigation) */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 z-20">
          <ProjectSocialBar onOpenCV={onOpenCV} />
        </div>
      </div>
    </div>
  );
}
