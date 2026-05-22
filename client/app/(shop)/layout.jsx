'use client';

import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Link from 'next/link';

export default function ShopLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative">
      
      {/* 1. Global Header Navigation */}
      <Navbar />

      {/* 2. Responsive mobile navigation triggers */}
      <MobileNav />

      {/* 3. Primary Content Canvas */}
      <main className="flex-grow pb-16 md:pb-0">{children}</main>

      {/* 4. Elegant Editorial Minimalist Footer */}
      <footer className="border-t border-border bg-background py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <span className="font-serif text-lg font-bold tracking-[0.25em] text-foreground">
              ATELIER
            </span>
            <p className="text-xs text-muted leading-relaxed font-medium">
              An exploration of luxury fashion constraint. Sourced from organic materials and crafted with architectural precision.
            </p>
          </div>

          {/* Directory */}
          <div>
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-foreground mb-4">
              Directory
            </h5>
            <ul className="space-y-2.5 text-xs text-muted font-medium">
              {['Shop All', 'Outerwear', 'Tailoring', 'Essentials'].map((dir) => (
                <li key={dir}>
                  <Link href="/products" className="hover:text-foreground transition-colors">
                    {dir}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-foreground mb-4">
              Client Services
            </h5>
            <ul className="space-y-2.5 text-xs text-muted font-medium">
              {['Atelier Care', 'Shipping & Returns', 'Book An Appointment', 'Sustainability'].map((help) => (
                <li key={help}>
                  <Link href="/profile" className="hover:text-foreground transition-colors">
                    {help}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Copyright/Socials */}
          <div className="space-y-4">
            <h5 className="text-[10px] tracking-[0.2em] font-semibold uppercase text-foreground mb-4">
              Connect
            </h5>
            <div className="flex gap-4 text-xs text-muted font-medium">
              {['Instagram', 'Journal', 'Newsletter'].map((social) => (
                <a key={social} href="#" className="hover:text-foreground transition-colors">
                  {social}
                </a>
              ))}
            </div>
            <p className="text-[10px] text-muted pt-2 font-medium">
              © {new Date().getFullYear()} ATELIER. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}
