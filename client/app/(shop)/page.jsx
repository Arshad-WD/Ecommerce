'use client';

import { useState, useEffect } from 'react';
import { testimonials } from '@/lib/mock-data';
import HeroSection from '@/components/home/HeroSection';
import ProductCard from '@/components/products/ProductCard';
import CategoryCard from '@/components/home/CategoryCard';
import BentoGrid from '@/components/home/BentoGrid';
import TestimonialCard from '@/components/home/TestimonialCard';
import { ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import Toast from '@/components/shared/Toast';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    import('@/lib/api').then(({ productApi }) => {
      // Load featured products
      productApi.listProducts({ limit: 4 }).then((res) => {
        setFeaturedProducts(res.products || []);
      }).catch(err => console.error(err));

      // Load categories
      productApi.listCategories().then((cats) => {
        setCategoriesList(cats || []);
      }).catch(err => console.error(err))
      .finally(() => setLoading(false));
    });
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setToast({ message: 'Thank you. You have been added to the Atelier list.', type: 'success' });
    e.target.reset();
  };

  return (
    <div className="space-y-24 md:space-y-36 pb-16">
      {/* 1. Cinematic Campaign Hero */}
      <HeroSection />

      {/* 2. Featured Products Gallery Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12">
          <div>
            <span className="text-[10px] tracking-[0.25em] font-semibold text-muted uppercase">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-foreground mt-2">
              Featured <span className="italic font-normal">Garments</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs uppercase tracking-widest font-bold text-foreground hover:text-muted flex items-center gap-1 shrink-0 mt-4 md:mt-0 transition-colors group"
          >
            View All Pieces
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-[3/4] bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-2/3" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Portraited Categories Editorial Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-muted uppercase">
            Architectural Cuts
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-foreground mt-2">
            Shop By <span className="italic font-normal">Line</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-neutral-200 dark:bg-neutral-800 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {categoriesList.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Asymmetric Bento Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-muted uppercase">
            Material and Craft
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-foreground mt-2">
            The Atelier <span className="italic font-normal">Chronicles</span>
          </h2>
        </div>
        <BentoGrid />
      </section>

      {/* 5. Luxury Testimonial Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.25em] font-semibold text-muted uppercase">
            Client Voices
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-foreground mt-2">
            Atelier <span className="italic font-normal">Credentials</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((test) => (
            <TestimonialCard key={test.id} testimonial={test} />
          ))}
        </div>
      </section>

      {/* 6. Minimal subscription newsletter section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="bg-secondary/40 border border-border p-10 md:p-16 rounded-2xl flex flex-col items-center">
          <Mail className="w-8 h-8 text-muted stroke-[1.25] mb-6" />
          <span className="text-[10px] tracking-[0.25em] font-semibold text-muted uppercase">
            Exclusive Communications
          </span>
          <h2 className="font-serif text-2xl md:text-4xl font-light uppercase tracking-wide text-foreground mt-2 mb-4">
            Join The Atelier <span className="italic font-normal">Dispatch</span>
          </h2>
          <p className="text-xs md:text-sm text-muted font-medium max-w-md leading-relaxed mb-8">
            Subscribe to receive early notifications of limited concepts, restocks, and private seasonal previews. No spam, purely structural.
          </p>

          <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="ENTER YOUR EMAIL..."
              className="flex-grow px-5 py-3.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              aria-label="Email address input"
              id="newsletter-email-input"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 hover:opacity-90 transition-opacity text-xs font-bold uppercase tracking-widest rounded-xl shrink-0"
              id="newsletter-subscribe-button"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    {/* Reusable Toast Notifications */}
    <Toast 
      message={toast.message} 
      type={toast.type} 
      onClose={() => setToast({ message: '', type: 'success' })} 
    />
  </div>
);
}
