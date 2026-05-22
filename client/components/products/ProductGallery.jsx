'use client';

import { useState } from 'react';

export default function ProductGallery({ images = [], productName }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-[3/4] bg-secondary rounded-xl animate-pulse" />;
  }

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4 w-full">
      {/* 1. Large Showcase Screen */}
      <div className="aspect-[3/4] w-full relative rounded-xl overflow-hidden bg-secondary select-none">
        <img
          src={images[activeIndex]}
          alt={`${productName} angle showcase`}
          className="w-full h-full object-cover object-center transition-all duration-500"
        />
        {/* Subtle monochrome lighting overlay */}
        <div className="absolute inset-0 pointer-events-none bg-black/[0.02] dark:bg-white/[0.02]" />
      </div>

      {/* 2. Interactive Thumbnail Columns (Responsive side listing) */}
      <div className="flex flex-row md:flex-col gap-3 shrink-0 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden shrink-0 border relative focus:outline-none transition-all ${
              activeIndex === idx
                ? 'border-foreground ring-[0.5px] ring-foreground'
                : 'border-border opacity-70 hover:opacity-100'
            }`}
            aria-label={`Showcase image angle ${idx + 1}`}
          >
            <img
              src={img}
              alt={`${productName} thumbnail ${idx + 1}`}
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/[0.02]" />
          </button>
        ))}
      </div>
    </div>
  );
}
