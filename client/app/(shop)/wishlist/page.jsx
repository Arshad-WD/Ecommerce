'use client';

import { useShop } from '@/lib/ShopContext';
import { products } from '@/lib/mock-data';
import { Trash2, ShoppingBag, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [toastMsg, setToastMsg] = useState('');

  // 1. Filter main items based on wishlist IDs
  const wishlistedItems = products.filter((prod) => wishlist.includes(prod.id));

  const handleMoveToCart = (product) => {
    // Add default size (usually S or first available)
    const defaultSize = product.sizes[0];
    addToCart(product, defaultSize, product.colors[0], 1);
    
    // Remove from wishlist
    toggleWishlist(product.id);
    
    setToastMsg(`Moved ${product.name} to your bag`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Page Header */}
      <div className="border-b border-border pb-6 mb-10">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-muted uppercase">
          Client Selections
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-foreground mt-2">
          Your Wishlist
        </h1>
      </div>

      {/* 2. Empty Wishlist State */}
      {wishlistedItems.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl p-8 max-w-lg mx-auto flex flex-col items-center">
          <Heart className="w-10 h-10 text-muted stroke-[1.25] mb-6 animate-pulse" />
          <h2 className="font-serif text-xl md:text-2xl uppercase tracking-wide text-foreground mb-3">
            Wishlist is empty
          </h2>
          <p className="text-xs md:text-sm text-muted font-medium leading-relaxed mb-8">
            You have not favorited any garments yet. Explore our latest concepts and seasonal pieces to curate your bespoke wardrobe.
          </p>
          <Link
            href="/products"
            className="group px-8 py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
          >
            Explore Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      ) : (
        /* 3. Wishlisted items grid */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-6">
          {wishlistedItems.map((prod) => (
            <div key={prod.id} className="flex flex-col h-full border border-border/30 p-3 rounded-2xl bg-secondary/10 hover:border-foreground/30 transition-colors group">
              
              {/* Product Image Frame */}
              <div className="aspect-[3/4] relative w-full overflow-hidden rounded-xl bg-secondary mb-4">
                <Link href={`/product/${prod.slug}`}>
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(prod.id)}
                  className="absolute top-3 right-3 p-2 bg-background/90 dark:bg-neutral-900/90 border border-border rounded-full hover:bg-background shadow-sm hover:scale-105 transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-4 h-4 text-muted hover:text-foreground stroke-[1.5]" />
                </button>
              </div>

              {/* Product Info details */}
              <div className="flex flex-col flex-grow">
                <span className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mb-1">
                  {prod.category}
                </span>
                <h3 className="font-serif text-sm font-semibold tracking-wide text-foreground line-clamp-1 mb-2">
                  <Link href={`/product/${prod.slug}`} className="hover:text-muted transition-colors">
                    {prod.name}
                  </Link>
                </h3>
                <div className="text-xs font-semibold tracking-wide mb-6">
                  {prod.discountPrice ? (
                    <div className="flex gap-2 items-center">
                      <span className="text-foreground">{formatCurrency(prod.discountPrice)}</span>
                      <span className="text-muted line-through font-normal text-[10px]">
                        {formatCurrency(prod.price)}
                      </span>
                    </div>
                  ) : (
                    <span>{formatCurrency(prod.price)}</span>
                  )}
                </div>

                {/* Move to bag CTA */}
                <button
                  onClick={() => handleMoveToCart(prod)}
                  className="w-full mt-auto py-3 bg-foreground text-background dark:bg-white dark:text-neutral-950 font-bold text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[1.5]" />
                  Move to Bag
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Dynamic Toast Notifications */}
      {toastMsg && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-foreground text-background dark:bg-white dark:text-neutral-950 px-6 py-4 rounded-xl shadow-xl flex items-center gap-2 animate-slide-up border border-border/20">
          <ShoppingBag className="w-4 h-4 stroke-[2]" />
          <div className="text-xs font-bold uppercase tracking-wider">{toastMsg}</div>
        </div>
      )}

    </div>
  );
}
