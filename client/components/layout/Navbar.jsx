'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, ShoppingBag, User } from 'lucide-react';
import { useShop } from '@/lib/ShopContext';
import SearchBar from '../shared/SearchBar';
import ThemeToggle from '../shared/ThemeToggle';
import MegaMenu from './MegaMenu';

export default function Navbar() {
  const { cart, wishlist } = useShop();
  const [activeMega, setActiveMega] = useState(null);
  const pathname = usePathname();

  const handleOpenMega = (menu) => {
    setActiveMega(menu);
  };

  const handleCloseMega = () => {
    setActiveMega(null);
  };

  // Check if link is active
  const isActive = (path) => pathname === path;

  // Calculate cart items total count
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between relative">
        
        {/* Left Side: Desktop Category Triggers */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link
            href="/products"
            className={`text-xs uppercase tracking-[0.2em] font-semibold transition-colors py-5 ${
              isActive('/products') ? 'text-foreground' : 'text-foreground/75 hover:text-foreground'
            } nav-link-underline`}
            onMouseEnter={() => handleOpenMega('shop')}
          >
            Shop
          </Link>
          <button
            className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/75 hover:text-foreground transition-colors py-5 focus:outline-none nav-link-underline"
            onMouseEnter={() => handleOpenMega('collections')}
          >
            Collections
          </button>
          <button
            className="text-xs uppercase tracking-[0.2em] font-semibold text-foreground/75 hover:text-foreground transition-colors py-5 focus:outline-none nav-link-underline"
            onMouseEnter={() => handleOpenMega('atelier')}
          >
            Our Atelier
          </button>
        </nav>

        {/* Center: Luxury Wordmark */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
          <Link 
            href="/" 
            className="font-serif text-xl sm:text-2xl font-bold tracking-[0.25em] text-foreground hover:opacity-85 transition-opacity"
            id="brand-logo"
          >
            ATELIER
          </Link>
        </div>

        {/* Right Side: Search, Theme, Wishlist, Cart, Profile */}
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {/* Global Search Component */}
          <SearchBar />

          {/* Global Theme Toggle */}
          <ThemeToggle />

          {/* Wishlist Link with dynamic badge */}
          <Link
            href="/wishlist"
            className="p-2 text-foreground/80 hover:text-foreground transition-colors relative"
            aria-label="Wishlist"
            id="navbar-wishlist-link"
          >
            <Heart className="w-[18px] h-[18px] stroke-[1.25]" />
            {wishlist.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-foreground rounded-full dark:bg-white animate-pulse" />
            )}
          </Link>

          {/* Cart Bag Link with dynamic item counter */}
          <Link
            href="/cart"
            className="p-2 text-foreground/80 hover:text-foreground transition-colors relative"
            aria-label="Cart Bag"
            id="navbar-cart-link"
          >
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.25]" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[15px] h-[15px] px-1 bg-foreground text-background text-[9px] font-bold rounded-full flex items-center justify-center dark:bg-white dark:text-neutral-900 border border-background">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile Accessor */}
          <Link
            href="/profile"
            className="p-2 text-foreground/80 hover:text-foreground transition-colors hidden sm:block"
            aria-label="User Profile"
            id="navbar-profile-link"
          >
            <User className="w-[18px] h-[18px] stroke-[1.25]" />
          </Link>
        </div>

        {/* Hover-activated MegaMenu dropdown overlay */}
        <MegaMenu activeCategory={activeMega} onClose={handleCloseMega} />
      </div>
    </header>
  );
}
