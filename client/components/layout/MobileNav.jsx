'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Heart, ShoppingBag, User, Menu, X, ArrowRight } from 'lucide-react';
import { useShop } from '@/lib/ShopContext';
import { categories } from '@/lib/mock-data';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, wishlist } = useShop();
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const isActive = (path) => pathname === path;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* 1. Mobile Top Minimal Header (Floating Hamburger Trigger) */}
      <div className="md:hidden fixed top-3 left-4 z-40">
        <button
          onClick={toggleMenu}
          className="p-2.5 bg-background/90 backdrop-blur border border-border rounded-full text-foreground shadow-sm hover:bg-secondary transition-colors"
          aria-label="Open navigation menu"
          id="mobile-menu-trigger"
        >
          {isOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
        </button>
      </div>

      {/* 2. Sliding Navigation Menu (Sidebar Drawer) */}
      {isOpen && (
        <div className="fixed inset-0 z-35 bg-background flex flex-col pt-24 px-6 pb-28 md:hidden animate-fade-in">
          {/* Main Navigation Links */}
          <div className="flex-1 overflow-y-auto space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted font-bold block">
                ATELIER DIRECTORY
              </span>
              <ul className="space-y-4 text-2xl font-serif">
                <li>
                  <Link href="/" onClick={closeMenu} className="hover:text-muted transition-colors flex items-center justify-between">
                    Home <ArrowRight className="w-4 h-4 text-muted" />
                  </Link>
                </li>
                <li>
                  <Link href="/products" onClick={closeMenu} className="hover:text-muted transition-colors flex items-center justify-between">
                    Shop All <ArrowRight className="w-4 h-4 text-muted" />
                  </Link>
                </li>
                <li>
                  <Link href="/profile" onClick={closeMenu} className="hover:text-muted transition-colors flex items-center justify-between">
                    My Account <ArrowRight className="w-4 h-4 text-muted" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted font-bold block">
                SHOP BY CATEGORY
              </span>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    onClick={closeMenu}
                    className="p-4 bg-secondary/50 border border-border rounded-xl flex flex-col justify-between hover:bg-secondary transition-colors"
                  >
                    <span className="font-serif text-sm font-semibold">{cat.name}</span>
                    <span className="text-[10px] text-muted mt-2">{cat.count} items</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Account Settings / Sessions */}
            <div className="space-y-3 pt-4 border-t border-border">
              <Link
                href="/login"
                onClick={closeMenu}
                className="block text-center w-full py-3 bg-foreground text-background text-xs uppercase tracking-widest font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={closeMenu}
                className="block text-center w-full py-3 border border-border text-foreground text-xs uppercase tracking-widest font-semibold rounded-xl hover:bg-secondary transition-colors"
              >
                Register An Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 3. Sticky Bottom Mobile Navigation Bar */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border/80 flex items-center justify-around h-16 px-4 pb-safe shadow-lg transition-colors duration-300"
        id="mobile-bottom-navbar"
      >
        <Link
          href="/"
          onClick={closeMenu}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${
            isActive('/') ? 'text-foreground font-semibold' : 'text-foreground/50'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[9px] uppercase tracking-wider mt-1">Home</span>
        </Link>

        <Link
          href="/products"
          onClick={closeMenu}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${
            isActive('/products') ? 'text-foreground font-semibold' : 'text-foreground/50'
          }`}
          aria-label="Browse Shop"
        >
          <Compass className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[9px] uppercase tracking-wider mt-1">Shop</span>
        </Link>

        <Link
          href="/wishlist"
          onClick={closeMenu}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-colors relative ${
            isActive('/wishlist') ? 'text-foreground font-semibold' : 'text-foreground/50'
          }`}
          aria-label="Wishlist"
        >
          <Heart className="w-5 h-5 stroke-[1.5]" />
          {wishlist.length > 0 && (
            <span className="absolute top-2 right-3 w-1.5 h-1.5 bg-foreground rounded-full dark:bg-white animate-pulse" />
          )}
          <span className="text-[9px] uppercase tracking-wider mt-1">Wishlist</span>
        </Link>

        <Link
          href="/cart"
          onClick={closeMenu}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-colors relative ${
            isActive('/cart') ? 'text-foreground font-semibold' : 'text-foreground/50'
          }`}
          aria-label="Cart bag"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
          {cartCount > 0 && (
            <span className="absolute top-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 bg-foreground text-background text-[8px] font-bold rounded-full flex items-center justify-center dark:bg-white dark:text-neutral-900 border border-background">
              {cartCount}
            </span>
          )}
          <span className="text-[9px] uppercase tracking-wider mt-1">Cart</span>
        </Link>

        <Link
          href="/profile"
          onClick={closeMenu}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${
            isActive('/profile') ? 'text-foreground font-semibold' : 'text-foreground/50'
          }`}
          aria-label="Profile Account"
        >
          <User className="w-5 h-5 stroke-[1.5]" />
          <span className="text-[9px] uppercase tracking-wider mt-1">Profile</span>
        </Link>
      </nav>
    </>
  );
}
