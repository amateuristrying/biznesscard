import React from "react";
import Image from "next/image";

interface CardFrontProps {
  isVisible: boolean;
}

export default function CardFront({ isVisible }: CardFrontProps) {
  const xOffset = -200;
  const yOffset = -150;
  const scale = 2.70;

  return (
    <div className="absolute inset-0 w-full h-full bg-[#DAD1BF] border-2 border-black flex flex-col justify-between p-10 md:p-20 select-none backface-hidden z-10">
      {/* Top Section */}
      <div className="flex justify-between items-start w-full">
        {/* Top Left Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black leading-[0.9] whitespace-pre-line">
          Vibe coding{"\n"}
          in prod
        </h1>

        {/* Top Right Serif List */}
        <div className="text-right font-serif text-xl md:text-2xl lg:text-3xl text-black/90 leading-[1.2] whitespace-pre-line tracking-tight">
          Code w/{"\n"}
          Antigravity{"\n"}
          Claude{"\n"}
          Codex{"\n"}
          Vercel
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end w-full">
        {/* Bottom Left Profile */}
        <div className="flex items-center gap-4 md:gap-5">
          {/* Avatar Image */}
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-black/[0.05] bg-white flex-shrink-0 relative">
            <Image
              src="/avatar.png"
              alt="Avatar Profile"
              fill
              className="object-cover select-none pointer-events-none"
              sizes="(max-width: 768px) 64px, 80px"
              unoptimized
            />
          </div>
          {/* Profile Text */}
          <div className="text-black leading-tight">
            <div className="text-lg md:text-2xl font-bold tracking-tight">
              Abhiroop Hiremath
            </div>
            <div className="text-sm md:text-base text-black/85 mt-0.5">
              Software Developer
            </div>
            <div className="text-sm md:text-base text-black/85">
              at Home
            </div>
          </div>
        </div>

        {/* Bottom Right Lanyard ID Card */}
        <div 
          className="relative w-[180px] h-[180px] md:w-[320px] md:h-[320px] lg:w-[380px] lg:h-[380px] flex-shrink-0 overflow-visible"
          style={{ visibility: isVisible ? "visible" : "hidden" }}
        >
          <Image
            src="/idcard.png"
            alt="Lanyard ID Card"
            fill
            sizes="(max-width: 768px) 180px, (max-width: 1024px) 320px, 380px"
            priority
            className="object-contain select-none pointer-events-none transition-transform duration-75"
            style={{
              transform: `translate(${xOffset}px, ${yOffset}px) scale(${scale})`,
            }}
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
