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

function SocialButton({
  icon,
  label,
  href,
  isHovered,
  onHoverEnter,
  onHoverLeave,
  onClick
}: SocialButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const isFirstRender = useRef(true);

  const collapsedWidth = 44;
  const expandedWidth = 44 + label.length * 9.5 + 16;

  useEffect(() => {
    const button = buttonRef.current;
    const pill = pillRef.current;
    const labelEl = labelRef.current;
    if (!button || !pill || !labelEl) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Clean up active animations on these elements to prevent overlay/stuck tweens
    gsap.killTweensOf([button, pill, labelEl]);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      // Setup initial collapsed state instantly on mount
      gsap.set(button, { width: collapsedWidth });
      gsap.set(pill, { clipPath: "circle(0px at 22px 44px)", opacity: 0 });
      gsap.set(labelEl, { y: 15, opacity: 0 });
      return;
    }

    if (isHovered) {
      if (prefersReducedMotion) {
        gsap.to(button, { width: expandedWidth, duration: 0 });
        gsap.to(pill, { clipPath: "circle(150% at 22px 22px)", opacity: 1, duration: 0 });
        gsap.to(labelEl, { y: 0, opacity: 1, duration: 0 });
      } else {
        gsap.to(button, {
          width: expandedWidth,
          duration: 0.4,
          ease: "power3.out"
        });
        gsap.to(pill, {
          clipPath: "circle(150% at 22px 22px)",
          opacity: 1,
          duration: 0.4,
          ease: "power3.out"
        });
        gsap.to(labelEl, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power3.out"
        });
      }
    } else {
      if (prefersReducedMotion) {
        gsap.to(button, { width: collapsedWidth, duration: 0 });
        gsap.to(pill, { clipPath: "circle(0px at 22px 44px)", opacity: 0, duration: 0 });
        gsap.to(labelEl, { y: 15, opacity: 0, duration: 0 });
      } else {
        gsap.to(button, {
          width: collapsedWidth,
          duration: 0.28,
          ease: "power2.inOut"
        });
        gsap.to(pill, {
          clipPath: "circle(0px at 22px 44px)",
          opacity: 0,
          duration: 0.28,
          ease: "power2.inOut"
        });
        gsap.to(labelEl, {
          y: 15,
          opacity: 0,
          duration: 0.28,
          ease: "power2.inOut"
        });
      }
    }
  }, [isHovered, expandedWidth]);

  return (
    <a
      ref={buttonRef}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      onFocus={onHoverEnter}
      onBlur={onHoverLeave}
      tabIndex={0}
      className="relative flex items-center h-11 rounded-full cursor-pointer overflow-hidden outline-none z-20 select-none flex-shrink-0"
      style={{ width: collapsedWidth }}
      onClick={onClick}
    >
      {/* Base Layer: Black icon centered */}
      <div className="absolute inset-0 flex items-center justify-center w-11 h-11 text-[var(--theme-text)] opacity-70 pointer-events-none transition-all duration-500">
        {icon}
      </div>

      {/* Pill Layer: Expanding Pill with Theme Color Content */}
      <div
        ref={pillRef}
        className="absolute inset-0 bg-[var(--theme-primary)] rounded-full flex items-center px-3 gap-2 h-11 overflow-hidden pointer-events-none select-none transition-colors duration-500"
        style={{
          width: "100%",
          clipPath: "circle(0px at 22px 44px)",
        }}
      >
        {/* Theme Centered Icon */}
        <div className="flex items-center justify-center w-5 h-5 text-[var(--theme-card-bg,var(--theme-bg))] flex-shrink-0 ml-[1px] transition-colors duration-500">
          {icon}
        </div>

        {/* Theme Sliding Text Label */}
        <span
          ref={labelRef}
          className="font-sans font-medium text-sm text-[var(--theme-card-bg,var(--theme-bg))] tracking-tight whitespace-nowrap block transition-colors duration-500"
          style={{ transform: "translateY(15px)", opacity: 0 }}
        >
          {label}
        </span>
      </div>
    </a>
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
