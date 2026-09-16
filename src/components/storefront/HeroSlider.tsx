'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeroSliderProps {
  desktopBanners: string[];
  mobileBanners: string[];
  eyebrow1: string;
  eyebrow2: string;
  title1: string;
  title2: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  scriptQuote: string;
}

export default function HeroSlider({
  desktopBanners,
  mobileBanners,
  eyebrow1,
  eyebrow2,
  title1,
  title2,
  description,
  ctaText,
  ctaLink,
  scriptQuote,
}: HeroSliderProps) {
  const [currentDesktopIndex, setCurrentDesktopIndex] = useState(0);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  // Auto-play for desktop banners if multiple
  useEffect(() => {
    if (desktopBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentDesktopIndex((prev) => (prev + 1) % desktopBanners.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [desktopBanners.length]);

  // Auto-play for mobile banners if multiple
  useEffect(() => {
    const totalMobile = mobileBanners.length > 0 ? mobileBanners.length : desktopBanners.length;
    if (totalMobile <= 1) return;
    const interval = setInterval(() => {
      setCurrentMobileIndex((prev) => (prev + 1) % totalMobile);
    }, 5500);
    return () => clearInterval(interval);
  }, [mobileBanners.length, desktopBanners.length]);

  // Fallback for mobile if no mobile banners uploaded
  const hasCustomMobileBanners = mobileBanners.length > 0;
  const activeMobileBanners = hasCustomMobileBanners ? mobileBanners : desktopBanners;

  return (
    <section className="relative w-full bg-[#FAF7F2] border-b border-border/50 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. MOBILE SPECIAL VIEW (< sm): Only when separate mobile banners uploaded */}
      {/* ========================================================================= */}
      {hasCustomMobileBanners && (
        <div className="sm:hidden flex flex-col w-full">
          <div className="relative w-full aspect-[4/5] bg-stone-100 overflow-hidden">
            {activeMobileBanners.map((url, idx) => (
              <div
                key={url + idx}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  idx === currentMobileIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={url}
                  alt={`AIZORA Mobile Banner ${idx + 1}`}
                  fill
                  className="object-cover object-top"
                  priority={idx === 0}
                  sizes="100vw"
                />
              </div>
            ))}

            {activeMobileBanners.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-1.5">
                {activeMobileBanners.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentMobileIndex(dotIdx)}
                    className={`h-1.5 rounded-full transition-all ${
                      dotIdx === currentMobileIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                    }`}
                    aria-label={`Slide ${dotIdx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. MAIN HERO DISPLAY (Exact match with reference laptop photo)            */}
      {/*    Full-bleed background image covering entire width & height             */}
      {/* ========================================================================= */}
      <div className={`relative w-full ${hasCustomMobileBanners ? 'hidden sm:block' : 'block'}`}>
        {/* Full-width Background Image Layer */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          {desktopBanners.length > 0 ? (
            desktopBanners.map((url, idx) => (
              <div
                key={url + idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentDesktopIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={url}
                  alt={`AIZORA Fashion Campaign ${idx + 1}`}
                  fill
                  className="object-cover object-[48%_center] sm:object-[48%_center] md:object-[49%_center] lg:object-[49%_center] xl:object-[51%_center] 2xl:object-[53%_center]"
                  priority={idx === 0}
                  sizes="100vw"
                />
                {/* Soft warm ivory wash over left side for crystal-clear readability */}
                <div className="absolute inset-y-0 left-0 w-full sm:w-[62%] md:w-[52%] lg:w-[46%] xl:w-[42%] bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/85 to-transparent z-10 pointer-events-none" />
              </div>
            ))
          ) : (
            <div className="w-full h-full bg-[#FAF7F2]" />
          )}
        </div>

        {/* Far-Right Script Quote: Positioned cleanly on open stone wall */}
        <div className="hidden lg:flex flex-col items-end text-right absolute right-4 sm:right-6 lg:right-8 xl:right-12 2xl:right-16 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
          <p className="font-script text-3xl sm:text-4xl xl:text-[42px] 2xl:text-[46px] text-[#8C6D53]/90 leading-[1.15] whitespace-pre-line drop-shadow-xs">
            {scriptQuote}
          </p>
          <div className="w-10 sm:w-12 h-0.5 bg-[#8C6D53]/60 mt-3 mr-1" />
        </div>

        {/* Foreground Content Container (Left-aligned with Header & Navbar) */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 min-h-[540px] sm:min-h-[580px] md:min-h-[620px] lg:min-h-[660px] xl:min-h-[700px] flex items-center pointer-events-none">
          {/* Left Column — Editorial Typography & CTA */}
          <div className="py-12 sm:py-16 lg:py-20 max-w-lg lg:max-w-xl pointer-events-auto">
            {/* Top Eyebrow */}
            <div className="space-y-0.5 mb-4 sm:mb-5">
              <p className="text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#8C6D53] font-body font-semibold">
                {eyebrow1}
              </p>
              <p className="text-[11px] sm:text-xs tracking-[0.26em] uppercase text-[#8C6D53] font-body font-semibold">
                {eyebrow2}
              </p>
            </div>

            {/* Main Title: WEAR YOUR ELEGANCE */}
            <div className="mb-4 sm:mb-5">
              <h1 className="font-heading font-normal text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] text-[#846249] tracking-[0.03em] leading-[1.08]">
                {title1}
              </h1>
              <h1 className="font-heading font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[80px] xl:text-[92px] text-[#714E36] tracking-[0.04em] leading-[0.98] mt-1">
                {title2}
              </h1>
            </div>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm md:text-base text-[#7C624E] font-body tracking-wide max-w-md mb-7 sm:mb-8 leading-relaxed">
              {description}
            </p>

            {/* CTA Button */}
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-2.5 bg-[#936E50] hover:bg-[#805C3F] text-white px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold transition-all rounded-[2px] shadow-sm group"
            >
              <span>{ctaText}</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            {/* Value Proposition Subline */}
            <div className="flex items-center gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12 text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#8C6D53] font-medium">
              <span>TIMELESS</span>
              <span className="text-[#C2B09F]">|</span>
              <span>VERSATILE</span>
              <span className="text-[#C2B09F]">|</span>
              <span>UNIQUELY YOU</span>
            </div>

            {/* Indicator Dots (4 dots: 1 filled, 3 outline) */}
            <div className="flex items-center gap-2 mt-4">
              <span className="w-2 h-2 rounded-full bg-[#3B291F]" />
              <span className="w-2 h-2 rounded-full border border-[#8C6D53]/70" />
              <span className="w-2 h-2 rounded-full border border-[#8C6D53]/70" />
              <span className="w-2 h-2 rounded-full border border-[#8C6D53]/70" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
