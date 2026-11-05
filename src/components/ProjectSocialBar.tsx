"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";

// Custom SVG Outline Icons matching Lucide's design language
const CVIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8M16 17H8M10 9H8" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4l11.73 16h4.27L8.27 4H4z" />
    <path d="M20 4L4 20" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isHovered: boolean;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

const SIZE = 44;
const HIDDEN_CLIP = `circle(0px at ${SIZE / 2}px ${SIZE}px)`;
const SHOWN_CLIP = `circle(150% at ${SIZE / 2}px ${SIZE / 2}px)`;

function SocialButton({
  icon,
  label,
  href,
  isHovered,
  onHoverEnter,
  onHoverLeave,
  onClick
}: SocialButtonProps) {
  const pillRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const pill = pillRef.current;
    const caption = captionRef.current;
    if (!pill || !caption) return;

    gsap.killTweensOf([pill, caption]);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(pill, { clipPath: HIDDEN_CLIP, opacity: 0 });
      gsap.set(caption, { opacity: 0.6, y: 0 });
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = prefersReducedMotion ? 0 : isHovered ? 0.4 : 0.28;
    const ease = isHovered ? "power3.out" : "power2.inOut";

    gsap.to(pill, {
      clipPath: isHovered ? SHOWN_CLIP : HIDDEN_CLIP,
      opacity: isHovered ? 1 : 0,
      duration,
      ease
    });
    gsap.to(caption, {
      opacity: isHovered ? 1 : 0.6,
      y: isHovered ? 2 : 0,
      duration,
      ease
    });
  }, [isHovered]);

  return (
    <div className="flex flex-col items-center gap-1 flex-shrink-0">
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
        aria-label={label}
        onMouseEnter={onHoverEnter}
        onMouseLeave={onHoverLeave}
        onFocus={onHoverEnter}
        onBlur={onHoverLeave}
        tabIndex={0}
        className="relative flex items-center justify-center w-11 h-11 rounded-full cursor-pointer overflow-hidden outline-none z-20 select-none"
        onClick={onClick}
      >
        {/* Base Layer: outline icon */}
        <div className="absolute inset-0 flex items-center justify-center text-[var(--theme-text)] opacity-70 pointer-events-none transition-all duration-500">
          {icon}
        </div>

        {/* Reveal Layer: theme-colored circle with inverted icon, centered */}
        <div
          ref={pillRef}
          className="absolute inset-0 bg-[var(--theme-primary)] rounded-full flex items-center justify-center pointer-events-none select-none transition-colors duration-500"
          style={{ clipPath: HIDDEN_CLIP, opacity: 0 }}
        >
          <div className="flex items-center justify-center w-5 h-5 text-[var(--theme-card-bg,var(--theme-bg))] transition-colors duration-500">
            {icon}
          </div>
        </div>
      </a>

      <span
        ref={captionRef}
        aria-hidden="true"
        className="text-center font-sans text-[10px] leading-none tracking-tight whitespace-nowrap text-[var(--theme-text)] pointer-events-none select-none transition-colors duration-500"
        style={{ opacity: 0.6 }}
      >
        {label}
      </span>
    </div>
  );
}

interface ProjectSocialBarProps {
  onOpenCV: () => void;
}

export default function ProjectSocialBar({ onOpenCV }: ProjectSocialBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const buttons = [
    { id: 0, label: "CV", icon: <CVIcon className="w-5 h-5" />, href: "#", isCV: true },
    { id: 2, label: "LinkedIn", icon: <LinkedinIcon className="w-5 h-5" />, href: "https://linkedin.com/in/abhiroop-hiremath-45a57928a" },
    { id: 3, label: "X", icon: <TwitterIcon className="w-5 h-5" />, href: "https://x.com/AbhidooP" },
    { id: 4, label: "GitHub", icon: <GithubIcon className="w-5 h-5" />, href: "https://github.com/amateuristrying" },
  ];

  return (
    <div className="flex items-center justify-center gap-5 md:gap-6 z-20">
      {buttons.map((btn) => (
        <SocialButton
          key={btn.id}
          icon={btn.icon}
          label={btn.label}
          href={btn.href}
          isHovered={hoveredIndex === btn.id}
          onHoverEnter={() => setHoveredIndex(btn.id)}
          onHoverLeave={() => setHoveredIndex((prev) => (prev === btn.id ? null : prev))}
          onClick={
            btn.isCV
              ? (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onOpenCV();
                }
              : (e) => e.stopPropagation()
          }
        />
      ))}
    </div>
  );
}
