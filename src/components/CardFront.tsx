import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import ThemeDock from "./ThemeDock";
import DecryptedText from "./DecryptedText";

interface CardFrontProps {
  isVisible: boolean;
  activeTheme: "classic" | "cyber";
  onChangeTheme: (theme: "classic" | "cyber") => void;
}

export default function CardFront({ isVisible, activeTheme, onChangeTheme }: CardFrontProps) {
  const xTextOffset = 43;
  const yTextOffset = -45;
  
  // Classic lanyard coordinates (locked in by user)
  const idCardX = -177;
  const idCardY = -233;
  const idCardScale = 2.30;

  // Cyber lanyard coordinates
  const cyberIdX = -200;
  const cyberIdY = -216;
  const cyberIdScale = 2.37;

  const isCyber = activeTheme === "cyber";

  return (
    <motion.div 
      className="absolute inset-0 w-full h-full bg-[var(--theme-card-bg,var(--theme-bg))] border-2 border-[var(--theme-border)] flex flex-col justify-between p-10 md:p-20 backface-hidden z-10"
      animate={{
        scale: isCyber ? 1.025 : 1,
      }}
      transition={{ duration: 1.0, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Top Section */}
      <div className="flex justify-between items-start w-full">
        {/* Top Left Title - Matches First Theme Font/Size Exactly but colorized and scrambled sequentially */}
        <h1 
          style={{ 
            transform: `translateY(${yTextOffset}px)`,
          }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[var(--theme-text)] leading-[0.9] whitespace-pre-line font-sans"
        >
          <DecryptedText
            key={activeTheme}
            text={`Vibe coding\nin prod`}
            animateOn="view"
            speed={100}
            sequential={true}
            revealDirection="start"
            useOriginalCharsOnly={false}
          />
        </h1>

        {/* Top Right List - Matches First Theme Font/Size Exactly but colorized and scrambled sequentially */}
        <div 
          style={{ transform: `translate(${xTextOffset}px, ${yTextOffset}px)` }}
          className="text-right font-serif text-xl md:text-2xl lg:text-3xl text-[var(--theme-text)] opacity-90 leading-[1.2] tracking-tight whitespace-pre-line"
        >
          <DecryptedText
            key={activeTheme}
            text={`Code w/\nAntigravity\nClaude\nCodex\nVercel`}
            animateOn="view"
            speed={100}
            sequential={true}
            revealDirection="start"
            useOriginalCharsOnly={false}
          />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end w-full">
        {/* Bottom Left Profile - Matches First Theme layout, font, size exactly but colorized and scrambled sequentially */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Avatar Image */}
          <div 
            className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 relative transition-all duration-[1000ms] ${
              isCyber
                ? "border border-[#FFD400] bg-[#1A1A1A]/80 backdrop-blur-sm"
                : "border border-[var(--theme-border)]/20 bg-white"
            }`}
          >
            <Image
              src="/avatar.png"
              alt="Avatar Profile"
              fill
              className="object-cover select-none pointer-events-none transition-all duration-[1000ms]"
              style={{
                filter: isCyber
                  ? "invert(1) sepia(1) saturate(12) hue-rotate(12deg) brightness(1.1) contrast(1.2)"
                  : "none"
              }}
              sizes="(max-width: 768px) 64px, 80px"
              unoptimized
            />
          </div>
          {/* Profile Text */}
          <div className="text-[var(--theme-text)] leading-tight">
            <div className="text-lg md:text-2xl font-bold tracking-tight font-sans text-[var(--theme-text)]">
              <DecryptedText
                key={activeTheme}
                text="Abhiroop Hiremath"
                animateOn="view"
                speed={100}
                sequential={true}
                revealDirection="start"
                useOriginalCharsOnly={false}
              />
            </div>
            <div className="text-sm md:text-base opacity-85 font-sans mt-0.5 text-[var(--theme-text)]">
              <DecryptedText
                key={activeTheme}
                text="Software Developer"
                animateOn="view"
                speed={100}
                sequential={true}
                revealDirection="start"
                useOriginalCharsOnly={false}
              />
            </div>
            <div className="text-sm md:text-base opacity-85 font-sans text-[var(--theme-text)]">
              <DecryptedText
                key={activeTheme}
                text="at Home"
                animateOn="view"
                speed={100}
                sequential={true}
                revealDirection="start"
                useOriginalCharsOnly={false}
              />
            </div>
          </div>
        </div>

        {/* Bottom Right Lanyard ID Card - Smoothly cross-fades using Framer Motion */}
        <div 
          className="relative w-[180px] h-[180px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] flex-shrink-0 overflow-visible"
          style={{ visibility: isVisible ? "visible" : "hidden" }}
        >
          {/* Classic Lanyard ID Card */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: isCyber ? 0 : 1 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            style={{ pointerEvents: isCyber ? "none" : "auto" }}
          >
            <Image
              src="/idcard.png"
              alt="Lanyard ID Card"
              fill
              sizes="(max-width: 768px) 180px, (max-width: 1024px) 320px, 380px"
              priority
              className="object-contain select-none pointer-events-none"
              style={{
                transform: `translate(${idCardX}px, ${idCardY}px) scale(${idCardScale})`,
              }}
              unoptimized
            />
          </motion.div>

          {/* Cyber Lanyard ID Card */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: isCyber ? 1 : 0 }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            style={{ pointerEvents: isCyber ? "auto" : "none" }}
          >
            <Image
              src="/cyber_idcard.png"
              alt="Cyber Lanyard ID Card"
              fill
              sizes="(max-width: 768px) 180px, (max-width: 1024px) 320px, 380px"
              priority
              className="object-contain select-none pointer-events-none"
              style={{
                transform: `translate(${cyberIdX}px, ${cyberIdY}px) scale(${cyberIdScale})`,
              }}
              unoptimized
            />
          </motion.div>
        </div>
      </div>

      {/* Floating Theme Selector Dock in the absolute bottom-right corner */}
      <div 
        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-50 pointer-events-auto"
        style={{ visibility: isVisible ? "visible" : "hidden" }}
        onClick={(e) => e.stopPropagation()} // Prevent card flip when clicking the dock
      >
        <ThemeDock activeTheme={activeTheme} onChangeTheme={onChangeTheme} />
      </div>
    </motion.div>
  );
}
