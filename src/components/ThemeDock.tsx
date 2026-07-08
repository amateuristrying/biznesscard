"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  MotionValue,
} from "framer-motion";

interface ThemeColors {
  bg: string;
  primary: string;
  secondary: string;
  shadow: string;
  outline: string;
  text: string;
  border: string;
}

interface ThemeConfig {
  id: "classic" | "cyber";
  label: string;
  colors: ThemeColors;
}

export const themes: Record<string, ThemeColors> = {
  classic: {
    bg: "#DAD1BF",
    primary: "#000000",
    secondary: "#f2eee6",
    shadow: "rgba(0, 0, 0, 0.2)",
    outline: "rgba(0, 0, 0, 0.15)",
    text: "#000000",
    border: "#000000",
  },
  cyber: {
    bg: "#050505",
    primary: "#FFD400",
    secondary: "#1A1A1A",
    shadow: "rgba(255, 212, 0, 0.25)",
    outline: "rgba(255, 212, 0, 0.3)",
    text: "#FFD400",
    border: "#FFD400",
  },
};

const themeConfigs: ThemeConfig[] = [
  { id: "classic", label: "Classic", colors: themes.classic },
  { id: "cyber", label: "Cyber", colors: themes.cyber },
];

// SVG noise texture filter definition to reuse
const PaperGrainFilter = () => (
  <svg className="absolute w-0 h-0" aria-hidden="true">
    <defs>
      <filter id="paper-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="3"
          result="noise"
        />
        <feColorMatrix
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.07 0"
        />
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
    </defs>
  </svg>
);

interface ThemeDockProps {
  activeTheme: "classic" | "cyber";
  onChangeTheme: (theme: "classic" | "cyber") => void;
}

export default function ThemeDock({ activeTheme, onChangeTheme }: ThemeDockProps) {
  const mouseX = useMotionValue(Infinity);
  const [screenType, setScreenType] = useState<
    "desktop" | "laptop" | "tablet" | "mobile" | "small"
  >("desktop");

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w > 1200) setScreenType("desktop");
      else if (w > 1024) setScreenType("laptop");
      else if (w > 768) setScreenType("tablet");
      else if (w > 480) setScreenType("mobile");
      else setScreenType("small");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const config = {
    desktop: { base: 44, hover: 60, max: 72, gap: 12, hoverGap: 6 },
    laptop: { base: 40, hover: 54, max: 66, gap: 10, hoverGap: 5 },
    tablet: { base: 36, hover: 48, max: 60, gap: 8, hoverGap: 4 },
    mobile: { base: 32, hover: 42, max: 50, gap: 6, hoverGap: 3 },
    small: { base: 28, hover: 36, max: 44, gap: 6, hoverGap: 3 },
  }[screenType];

  return (
    <div
      className="flex items-center select-none"
      style={{
        gap: mouseX.get() === Infinity ? config.gap : config.hoverGap,
        transition: "gap 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
      }}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      <PaperGrainFilter />
      {themeConfigs.map((theme) => (
        <ThemeBall
          key={theme.id}
          id={theme.id}
          label={theme.label}
          active={activeTheme === theme.id}
          colors={theme.colors}
          onClick={() => onChangeTheme(theme.id)}
          mouseX={mouseX}
          config={config}
        />
      ))}
    </div>
  );
}

interface ThemeBallProps {
  id: "classic" | "cyber";
  label: string;
  active: boolean;
  colors: ThemeColors;
  onClick: () => void;
  mouseX: MotionValue<number>;
  config: { base: number; hover: number; max: number };
}

function ThemeBall({
  id,
  label,
  active,
  colors,
  onClick,
  mouseX,
  config,
}: ThemeBallProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Parallax values for the inside artwork
  const artworkX = useMotionValue(0);
  const artworkY = useMotionValue(0);
  const artworkRotate = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 20 };
  const artworkSpringX = useSpring(artworkX, springConfig);
  const artworkSpringY = useSpring(artworkY, springConfig);
  const artworkSpringRotate = useSpring(artworkRotate, springConfig);

  // Dynamic float / idle animations
  const [idleY, setIdleY] = useState(0);
  const [idleRotate, setIdleRotate] = useState(0);

  useEffect(() => {
    // Generate random float offset to avoid synchronization
    const randomPhaseY = Math.random() * Math.PI * 2;
    const randomPhaseRot = Math.random() * Math.PI * 2;
    const speedY = 0.0015 + Math.random() * 0.001;
    const speedRot = 0.001 + Math.random() * 0.0008;

    let frameId: number;
    const tick = (time: number) => {
      if (!isHovered) {
        setIdleY(Math.sin(time * speedY + randomPhaseY) * 2);
        setIdleRotate(Math.cos(time * speedRot + randomPhaseRot) * 1);
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isHovered]);

  // macOS Dock magnification logic
  const distance = useTransform(mouseX, (val) => {
    if (val === Infinity) return Infinity;
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    const elX = bounds.left + bounds.width / 2;
    return val - elX;
  });

  const rawSize = useTransform(distance, (dist) => {
    if (dist === Infinity) return config.base;
    const d = Math.abs(dist);
    if (d > 100) return config.base;
    // Spring-like interpolation from base to max size
    return config.max - (d / 100) * (config.max - config.base);
  });

  const size = useSpring(rawSize, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return;
    const mx = e.clientX - bounds.left - bounds.width / 2;
    const my = e.clientY - bounds.top - bounds.height / 2;
    // Normalize coordinates (-1 to 1)
    const normX = mx / (bounds.width / 2);
    const normY = my / (bounds.height / 2);

    artworkX.set(normX * 5); // Translate artwork up to 5px
    artworkY.set(normY * 5);
    artworkRotate.set(normX * 12); // Rotate artwork up to 12 degrees
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    artworkX.set(0);
    artworkY.set(0);
    artworkRotate.set(0);
  };

  // Keyboard accessibility triggers
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute bottom-full mb-3 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold select-none pointer-events-none z-50 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#f2eee6]"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={ref}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onKeyDown={handleKeyDown}
        aria-label={`Switch to ${label} theme`}
        aria-pressed={active}
        tabIndex={0}
        className="relative outline-none border-none bg-transparent cursor-pointer flex items-center justify-center p-0"
        style={{
          width: size,
          height: size,
          y: isHovered ? -10 : idleY,
          rotate: isHovered ? 5 : idleRotate,
        }}
        whileTap={{ scale: 0.93 }}
      >
        <BallArtwork
          id={id}
          active={active}
          colors={colors}
          isHovered={isHovered}
          artworkX={artworkSpringX}
          artworkY={artworkSpringY}
          artworkRotate={artworkSpringRotate}
        />

        {/* Ambient & Contact Shadow */}
        <BallShadow isHovered={isHovered} size={size} colors={colors} />

        {/* Active Ring & Hand Drawn Underline */}
        <AnimatePresence>
          {active && (
            <motion.div
              layoutId="activeUnderline"
              className="absolute -bottom-2 w-3/5 h-1 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <svg viewBox="0 0 40 4" fill="none" className="w-full h-full">
                <path
                  d="M 2 2 Q 10 1 20 2 Q 30 3 38 2"
                  stroke={colors.border}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

interface BallArtworkProps {
  id: "classic" | "cyber";
  active: boolean;
  colors: ThemeColors;
  isHovered: boolean;
  artworkX: MotionValue<number>;
  artworkY: MotionValue<number>;
  artworkRotate: MotionValue<number>;
}

const BallArtwork = React.memo(function BallArtwork({
  id,
  active,
  colors,
  isHovered,
  artworkX,
  artworkY,
  artworkRotate,
}: BallArtworkProps) {
  // Define themes inside the SVGs dynamically
  const fillBg = id === "classic" ? colors.secondary : id === "cyber" ? "#1a1a1a" : "#1e293b";
  const colorA = id === "classic" ? "#000000" : id === "cyber" ? "#000000" : "#05070c";
  const colorB = id === "classic" ? "#fafaf8" : id === "cyber" ? "#ffdd00" : "#ffffff";
  const colorC = id === "classic" ? "#f2eee6" : id === "cyber" ? "#2a2a2a" : "#1e293b";

  return (
    <div className="relative w-full h-full rounded-full overflow-hidden select-none pointer-events-none">
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        {/* Sphere Base Masked Clip */}
        <g clipPath="url(#sphere-clip)">
          {/* Sphere Background Fill */}
          <path
            d="M 50,6 C 75.5,5.2 94.8,24.3 94.2,49.5 C 93.6,74.7 75.1,94.2 49.8,93.5 C 24.5,92.8 5.8,74.1 6.5,48.9 C 7.2,23.7 24.5,6.8 50,6"
            fill={fillBg}
            filter="url(#paper-noise)"
            className="transition-colors duration-700"
          />

          {/* Interactive Parallax Inner Swirl Ribbon artwork */}
          <motion.g
            style={{
              x: artworkX,
              y: artworkY,
              rotate: artworkRotate,
              originX: "50px",
              originY: "50px",
            }}
          >
            {/* Ribbon C (Underlay Shadow/Depth) */}
            <path
              d="M 12 40 C 25 15, 65 10, 85 30 C 95 40, 90 60, 75 75 C 60 90, 35 85, 20 70 C 10 55, 15 45, 25 45 C 35 45, 45 55, 55 60 C 65 65, 75 55, 75 45 C 75 35, 60 30, 45 35 C 30 40, 25 55, 35 65 C 45 75, 65 75, 75 60 C 85 45, 80 25, 60 20 C 40 15, 20 25, 12 40 Z"
              fill={colorC}
              className="transition-colors duration-700"
            />

            {/* Ribbon A (Main sweeping flow) */}
            <path
              d="M 15 25 C 35 10, 70 30, 85 50 C 90 65, 75 85, 55 85 C 35 85, 20 65, 25 45 C 30 25, 60 30, 70 45 C 80 60, 60 75, 45 70 C 30 65, 35 50, 45 45 C 55 40, 60 50, 55 55 C 50 60, 40 55, 42 50 C 44 45, 50 48, 48 50"
              fill="none"
              stroke={colorA}
              strokeWidth="20"
              strokeLinecap="round"
              className="transition-colors duration-700"
            />

            {/* Ribbon B (Secondary wrapping ribbon) */}
            <path
              d="M 88 60 C 75 85, 35 90, 15 70 C 5 60, 10 40, 25 25 C 40 10, 65 15, 80 30 C 90 45, 85 55, 75 55 C 65 55, 55 45, 45 40 C 35 35, 25 45, 25 55 C 25 65, 40 70, 55 65 C 70 60, 75 45, 65 35 C 55 25, 35 25, 25 40 C 15 55, 20 75, 40 80 C 60 85, 80 75, 88 60 Z"
              fill={colorB}
              className="transition-colors duration-700"
            />

            {/* Hand Drawn Shading/Hatching details for volume */}
            <path
              d="M 30,22 Q 35,32 32,45 M 42,27 Q 48,37 45,50 M 52,32 Q 58,42 55,55 M 24,55 Q 32,60 40,58 M 65,65 Q 58,72 50,70"
              stroke={id === "classic" ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.15)"}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="2 3"
            />
          </motion.g>

          {/* Spherical Ambient Shading/Volume Layer */}
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="url(#sphere-shading)"
            style={{ mixBlendMode: "multiply" }}
          />
        </g>

        {/* Hand drawn outline of the sphere */}
        <path
          d="M 50,6 C 75.5,5.2 94.8,24.3 94.2,49.5 C 93.6,74.7 75.1,94.2 49.8,93.5 C 24.5,92.8 5.8,74.1 6.5,48.9 C 7.2,23.7 24.5,6.8 50,6"
          stroke={colors.border}
          strokeWidth={active ? "3.2" : "2"}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-700"
        />

        {/* Dynamic hand-drawn double ring outline if active */}
        {active && (
          <path
            d="M 51,4 C 77.5,3.2 96.8,22.3 96.2,47.5 C 95.6,72.7 77.1,92.2 51.8,91.5 C 26.5,90.8 7.8,72.1 8.5,46.9 C 9.2,21.7 26.5,4.8 51,4"
            stroke={colors.border}
            strokeWidth="0.8"
            strokeDasharray="6 4"
            className="transition-colors duration-700"
          />
        )}

        {/* Radial Shading Gradient */}
        <defs>
          <radialGradient
            id="sphere-shading"
            cx="35%"
            cy="35%"
            r="65%"
            fx="30%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#888888" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </radialGradient>

          <clipPath id="sphere-clip">
            <path d="M 50,6 C 75.5,5.2 94.8,24.3 94.2,49.5 C 93.6,74.7 75.1,94.2 49.8,93.5 C 24.5,92.8 5.8,74.1 6.5,48.9 C 7.2,23.7 24.5,6.8 50,6" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
});

interface BallShadowProps {
  isHovered: boolean;
  size: MotionValue<number>;
  colors: ThemeColors;
}

function BallShadow({ isHovered, size, colors }: BallShadowProps) {
  // Smoothly scaling shadow offset & scale on hover
  const shadowScale = useTransform(size, (s) => (s / 44) * (isHovered ? 1.2 : 1));
  const shadowOpacity = isHovered ? 0.35 : 0.25;

  return (
    <motion.div
      className="absolute -bottom-1 pointer-events-none rounded-full blur-[2px] z-[-1] transition-all duration-300"
      style={{
        width: "90%",
        height: 6,
        background: `radial-gradient(ellipse at center, ${colors.shadow} 0%, rgba(0,0,0,0) 70%)`,
        opacity: shadowOpacity,
        scaleX: shadowScale,
        scaleY: isHovered ? 0.8 : 1,
      }}
    />
  );
}
