'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border py-4 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left py-2 font-serif text-base tracking-wide uppercase font-semibold text-foreground focus:outline-none"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-foreground' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-xs md:text-sm text-muted leading-relaxed pb-4 font-medium font-sans">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
