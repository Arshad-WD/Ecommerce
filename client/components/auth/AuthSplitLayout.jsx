'use client';

import Link from 'next/link';
import ThemeToggle from '../shared/ThemeToggle';

export default function AuthSplitLayout({ children, image, title, quote }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      
      {/* Absolute floating controls (Home & Dark mode options) */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="font-serif text-lg font-bold tracking-[0.25em] text-foreground hover:opacity-80 transition-opacity"
        >
          ATELIER
        </Link>
      </div>

      <div className="absolute top-4 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Left Canvas: Form content (centered vertically) */}
      <main className="flex-1 flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-20 z-10">
        <div className="mx-auto w-full max-w-sm">
          {children}
        </div>
      </main>

      {/* Right Canvas: Editorial full-height lookbook showcase (hidden on mobile) */}
      <section className="hidden md:flex md:w-[45%] lg:w-[50%] relative overflow-hidden bg-neutral-900 shrink-0 select-none">
        <img
          src={image || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=1200"}
          alt="Campaign Lookbook detail"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-black/35" />
        
        {/* Editorial statement overlay */}
        <div className="absolute inset-0 p-12 lg:p-16 flex flex-col justify-end text-white">
          <span className="text-[10px] tracking-[0.3em] font-semibold text-neutral-300 uppercase mb-3 block">
            Atelier Campaign
          </span>
          <h2 className="font-serif text-3xl lg:text-5xl font-light uppercase tracking-wide leading-tight mb-4 text-white">
            {title || "Silent Form"}
          </h2>
          <p className="font-serif italic text-sm text-neutral-300 max-w-sm border-l border-white/20 pl-4 py-1 leading-relaxed">
            {quote || '"Design is not the absence of clutter, but the presence of structural clarity."'}
          </p>
        </div>
      </section>

    </div>
  );
}
