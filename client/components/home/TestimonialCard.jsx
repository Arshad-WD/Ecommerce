'use client';

import { Quote } from 'lucide-react';

export default function TestimonialCard({ testimonial }) {
  const { name, role, quote, avatar } = testimonial;

  return (
    <div className="bg-background border border-border p-8 rounded-xl flex flex-col justify-between hover:border-foreground/30 transition-all duration-300 relative shadow-sm h-full group">
      
      {/* Decorative luxury quotes icon */}
      <Quote className="absolute top-6 right-8 w-8 h-8 text-neutral-100 dark:text-neutral-900 group-hover:text-neutral-200 dark:group-hover:text-neutral-800 transition-colors stroke-[1.25]" />

      <div className="relative z-10 flex-1 flex flex-col justify-between pt-4">
        {/* Quote text in elegant italic serif */}
        <p className="font-serif text-lg md:text-xl text-foreground/90 italic leading-relaxed mb-8 select-none">
          &quot;{quote}&quot;
        </p>

        {/* Customer Profile detail */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-[11px] font-bold text-foreground font-sans shrink-0">
            {avatar}
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-foreground">
              {name}
            </h4>
            <p className="text-[10px] text-muted tracking-wider uppercase mt-0.5">
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
