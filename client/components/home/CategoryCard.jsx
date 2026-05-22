'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({ category }) {
  const { name, slug, count, image } = category;

  return (
    <Link
      href={`/products?category=${slug}`}
      className="group block relative w-full aspect-[3/4] md:aspect-[4/5] rounded-xl overflow-hidden bg-secondary shadow-sm hover:shadow-md transition-all duration-500"
      id={`category-card-${slug}`}
    >
      {/* Zoom-on-hover campaign photo */}
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Elegant minimalist gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

      {/* Floating Category Info */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-[10px] tracking-wider uppercase text-neutral-300 font-semibold mb-1 block">
              {count} PIECES
            </span>
            <h3 className="font-serif text-2xl font-normal tracking-wide text-white uppercase">
              {name}
            </h3>
          </div>
          
          <div className="p-2 border border-white/20 rounded-full group-hover:border-white/90 group-hover:bg-white group-hover:text-black transition-all duration-300 shrink-0 mb-1">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}
