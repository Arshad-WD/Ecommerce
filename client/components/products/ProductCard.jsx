'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Plus } from 'lucide-react';
import { useShop } from '@/lib/ShopContext';
import { formatCurrency } from '@/lib/utils';

export default function ProductCard({ product }) {
  const { id, name, slug, category, price, discountPrice, images, sizes } = product;
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [hovered, setHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const isWishlisted = wishlist.includes(id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickAdd(!showQuickAdd);
  };

  const handleSelectSize = (e, size) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, product.colors[0], 1);
    setShowQuickAdd(false);
  };

  return (
    <div
      className="group relative flex flex-col w-full h-full bg-background transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowQuickAdd(false);
      }}
      id={`product-card-${id}`}
    >
      {/* 1. Portrait Image Container */}
      <div className="aspect-[3/4] relative w-full overflow-hidden rounded-xl bg-secondary mb-4">
        <Link href={`/product/${slug}`} className="block w-full h-full">
          {/* Main Campaign Image */}
          <img
            src={images[0]}
            alt={name}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
              hovered && images[1] ? 'scale-102 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
          {/* Secondary Campaign Image (Revealed on Hover) */}
          {images[1] && (
            <img
              src={images[1]}
              alt={`${name} lookbook angle`}
              className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out ${
                hovered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
            />
          )}
        </Link>

        {/* Favorite Heart Trigger */}  
        <button
          onClick={handleWishlistClick}
          className="absolute top-4 right-4 p-2 bg-background/90 dark:bg-neutral-900/90 border border-border/50 rounded-full text-foreground  shadow-sm hover:scale-105 transition-all z-20"
          
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          id={`wishlist-button-${id}`}
        >
          <Heart
            className={`w-4 h-4 stroke-[1.5] ${
              isWishlisted ? 'fill-foreground stroke-foreground dark:fill-white dark:stroke-white' : 'text-white'
            }`}
          />
        </button>

        {/* Quick Add Size Panel Drawer */}
        <div
          className={`absolute inset-x-0 bottom-0 z-20 bg-background/95 backdrop-blur border-t border-border p-4 transition-transform duration-300 ease-out flex flex-col gap-2 translate-y-full ${
            showQuickAdd ? '!translate-y-0' : 'group-hover:translate-y-full'
          }`}
        >
          <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-muted text-center">
            Select Size
          </span>
          <div className="flex gap-1.5 justify-center flex-wrap">
            {sizes.map((sz) => (
              <button
                key={sz}
                onClick={(e) => handleSelectSize(e, sz)}
                className="w-8 h-8 rounded-lg border border-border text-[10px] font-bold hover:border-foreground hover:bg-foreground hover:text-background transition-colors flex items-center justify-center"
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Hover quick-add overlay (Desktop only, displays trigger if size selector closed) */}
        {!showQuickAdd && (
          <div className="absolute inset-x-4 bottom-4 z-10 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
            <button
              onClick={handleQuickAddClick}
              className="w-full py-3 bg-background/95 border border-border text-foreground hover:bg-foreground hover:text-background text-[10px] font-bold tracking-widest uppercase rounded-lg flex items-center justify-center gap-2 shadow-md"
              id={`quick-add-trigger-${id}`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Quick Add
            </button>
          </div>
        )}

        {/* Mobile quick-add trigger (Pinned miniature toggle) */}
        <button
          onClick={handleQuickAddClick}
          className="absolute bottom-4 right-4 md:hidden p-2.5 bg-background/95 border border-border rounded-full shadow-md z-15"
          aria-label="Toggle size panel drawer"
        >
          <Plus className="w-4 h-4 text-foreground" />
        </button>
      </div>

      {/* 2. Product Information Panel */}
      <div className="flex flex-col flex-1">
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold mb-1">
          {category}
        </span>
        <h3 className="font-serif text-sm font-semibold tracking-wide text-foreground line-clamp-1 mb-1.5">
          <Link href={`/product/${slug}`} className="hover:text-muted transition-colors">
            {name}
          </Link>
        </h3>
        <div className="text-xs font-semibold tracking-wide mt-auto">
          {discountPrice ? (
            <div className="flex gap-2 items-center">
              <span className="text-foreground">{formatCurrency(discountPrice)}</span>
              <span className="text-muted line-through font-normal text-[10px]">
                {formatCurrency(price)}
              </span>
            </div>
          ) : (
            <span>{formatCurrency(price)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
