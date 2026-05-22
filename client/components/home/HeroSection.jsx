'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] md:h-[92vh] flex items-center justify-center overflow-hidden bg-neutral-950">
      
      {/* 1. Cinematic Monochrome Background Image with deep overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=2000"
          alt="Atelier Monochrome Campaign"
          className="w-full h-full object-cover object-center opacity-60 dark:opacity-40 scale-105 animate-pulse-slow"
        />
        {/* Subtle dark vignette overlay */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
      </div>

      {/* 2. Structured Editorial Content Layer */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white flex flex-col items-center">
        <span className="text-[10px] tracking-[0.3em] font-semibold uppercase text-neutral-300 mb-4 animate-fade-in block">
          ATELIER COLLECTION VOL. III
        </span>
        
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl tracking-wide leading-[1.05] font-normal uppercase text-white mb-6 max-w-4xl select-none">
          Silent <br className="sm:hidden" />
          <span className="italic font-light">Symmetry</span>
        </h1>
        
        <p className="text-sm sm:text-base text-neutral-300 font-medium tracking-wide max-w-lg mb-10 leading-relaxed">
          An exploration of architectural weight and structural restraint. Cut from heavyweight dry cottons and finished with raw industrial finishes.
        </p>

        {/* Clean, premium CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/products"
            className="group flex items-center justify-center gap-2 px-8 py-4 bg-white text-neutral-900 text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-neutral-200 transition-colors shadow-lg"
            id="hero-primary-cta"
          >
            Discover Collection
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/products?category=outerwear"
            className="px-8 py-4 border border-white/30 text-white hover:border-white hover:bg-white/5 text-xs uppercase tracking-widest font-bold rounded-xl transition-all"
            id="hero-secondary-cta"
          >
            Explore Outerwear
          </Link>
        </div>
      </div>

      {/* 3. Bottom Aesthetic Accent - Floating scroll indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 hidden md:flex flex-col items-center gap-2 z-10 text-white/50">
        <span className="text-[9px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-[1px] h-10 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-4 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
