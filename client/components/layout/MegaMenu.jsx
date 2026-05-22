'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { categories } from '@/lib/mock-data';

export default function MegaMenu({ activeCategory, onClose }) {
  if (!activeCategory) return null;

  // Render content based on hovered mega-menu trigger
  const renderContent = () => {
    switch (activeCategory) {
      case 'collections':
        return (
          <div className="grid grid-cols-4 gap-12 w-full">
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-muted">Seasonal Lines</h4>
              <ul className="space-y-2.5 text-sm font-medium">
                {['Atelier Core Vol. III', 'Tailoring Concept 02', 'Summer Linen Edit', 'The Loungewear Suite'].map((col) => (
                  <li key={col}>
                    <Link href="/products" onClick={onClose} className="hover:text-muted transition-colors">
                      {col}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-muted">Special Concepts</h4>
              <ul className="space-y-2.5 text-sm font-medium">
                {['Matte Titanium Series', 'Undyed Cashmere', 'Organic Dry-Denim', 'Archive Restocks'].map((col) => (
                  <li key={col}>
                    <Link href="/products" onClick={onClose} className="hover:text-muted transition-colors">
                      {col}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 relative h-[220px] rounded-xl overflow-hidden group bg-neutral-900">
              <img
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&q=80&w=800"
                alt="Editorial Campaign"
                className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-6">
                <span className="text-[9px] uppercase tracking-[0.25em] text-neutral-300 font-bold mb-1">New In</span>
                <h5 className="font-serif text-xl text-white mb-2 leading-snug">The Architecture of Silence</h5>
                <Link
                  href="/products"
                  onClick={onClose}
                  className="text-xs text-white font-semibold flex items-center gap-1 hover:underline underline-offset-4"
                >
                  View Lookbook <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        );

      case 'shop':
        return (
          <div className="grid grid-cols-5 gap-8 w-full">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                onClick={onClose}
                className="group flex flex-col"
              >
                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-secondary relative mb-3">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/5 dark:bg-black/20 group-hover:bg-black/15 transition-colors" />
                </div>
                <h5 className="font-serif text-base text-foreground font-semibold group-hover:text-muted transition-colors">
                  {cat.name}
                </h5>
                <span className="text-[10px] text-muted tracking-wider mt-0.5">
                  {cat.count} Pieces
                </span>
              </Link>
            ))}
          </div>
        );

      case 'atelier':
        return (
          <div className="grid grid-cols-3 gap-12 w-full">
            <div className="col-span-1 space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-muted">Philosophy</h4>
              <p className="text-sm text-muted font-medium leading-relaxed">
                ATELIER is dedicated to high-end textile restraint. Our items represent years of pattern adjustments, weight validations, and architectural cuts designed to last a lifetime.
              </p>
              <Link
                href="/products"
                onClick={onClose}
                className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1 hover:underline underline-offset-4"
              >
                Our Manifesto <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="col-span-1 space-y-4">
              <h4 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-muted">Craftsmanship</h4>
              <p className="text-sm text-muted font-medium leading-relaxed">
                From Japanese technical mills to family-owned Italian suede artisans, we source textiles from historical workshops holding generations of structural integrity.
              </p>
            </div>
            <div className="col-span-1 relative h-[220px] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800"
                alt="Production Detail"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-neutral-900/10" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="absolute top-full left-0 right-0 bg-background border-b border-border shadow-sm z-40 transition-all duration-300 animate-slide-down"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {renderContent()}
      </div>
    </div>
  );
}
