'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function BentoGrid() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[240px] md:auto-rows-[280px]">
        
        {/* 1. Large Editorial Photo (Row span 2, Col span 2) */}
        <div className="md:col-span-2 md:row-span-2 relative rounded-xl overflow-hidden group bg-neutral-900">
          <img
            src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200"
            alt="Atelier Tailoring Campaign"
            className="w-full h-full object-cover object-center opacity-85 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-neutral-300 mb-2 uppercase">
              Limited Edition Series
            </span>
            <h3 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-white mb-4">
              Structural <br />
              <span className="italic font-normal">Restraint</span>
            </h3>
            <p className="text-sm text-neutral-300 max-w-md mb-6 leading-relaxed font-medium">
              Every detail is considered. Cut with precision shoulders, custom horn buttons, and fully taped internal seams that represent pure sartorial discipline.
            </p>
            <Link
              href="/products"
              className="w-max group flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] uppercase tracking-widest font-bold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Shop Concept
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 2. Text Manifesto Block (Col span 1, Row span 1) */}
        <div className="bg-secondary/60 dark:bg-secondary/20 border border-border p-8 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-[9px] tracking-[0.2em] font-semibold uppercase text-muted block mb-3">
              01 / Our Philosophy
            </span>
            <h4 className="font-serif text-xl font-normal uppercase text-foreground mb-3">
              Made to Hold Shape
            </h4>
            <p className="text-xs text-muted leading-relaxed font-medium">
              We reject modern disposable tailoring. Our garments utilize high-weight custom weaves that maintain their silhouette through years of constant wear.
            </p>
          </div>
          <Link
            href="/products"
            className="text-[10px] uppercase tracking-wider font-bold text-foreground hover:text-muted transition-colors flex items-center gap-1 mt-4"
          >
            Read Manifesto <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3. Accessory Teaser Block (Col span 1, Row span 2) */}
        <div className="md:row-span-2 relative rounded-xl overflow-hidden group bg-neutral-900">
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000"
            alt="Titanium Watch Campaign"
            className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
          <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-neutral-300 mb-2 uppercase">
              Featured Accessory
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-light uppercase tracking-wide text-white mb-2">
              Brushed <br />
              <span className="italic font-normal">Titanium</span>
            </h3>
            <p className="text-xs text-neutral-300 mb-6 leading-relaxed font-medium">
              Precision Swiss quartz movement encapsulated in sandblasted matte casing.
            </p>
            <Link
              href="/product/matte-brushed-titanium-chronograph"
              className="w-max group flex items-center gap-2 px-5 py-2.5 bg-white text-black text-[9px] uppercase tracking-widest font-bold rounded-lg hover:bg-neutral-200 transition-colors"
            >
              View Chronograph
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4. Luxury Sourcing Block (Col span 1, Row span 1) */}
        <div className="bg-secondary/60 dark:bg-secondary/20 border border-border p-8 rounded-xl flex flex-col justify-between">
          <div>
            <span className="text-[9px] tracking-[0.2em] font-semibold uppercase text-muted block mb-3">
              02 / Textile Sourcing
            </span>
            <h4 className="font-serif text-xl font-normal uppercase text-foreground mb-3">
              Honorable Materials
            </h4>
            <p className="text-xs text-muted leading-relaxed font-medium">
              We exclusively use GOTS-certified organic cottons, pure cashmere, and full-grain vegetable tanned hides sourced from select European heritage tanneries.
            </p>
          </div>
          <span className="text-[9px] uppercase tracking-widest text-muted font-bold block mt-4">
            Atelier Standards
          </span>
        </div>

      </div>
    </section>
  );
}
