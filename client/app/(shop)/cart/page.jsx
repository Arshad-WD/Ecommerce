'use client';

import { useShop } from '@/lib/ShopContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Ticket, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { useState } from 'react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    couponCode,
    discountPercent,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShipping,
    getTotal,
    clearCart,
  } = useShop();

  const [promoVal, setPromoVal] = useState('');
  const [promoError, setPromoError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoVal.trim()) return;

    const success = applyCoupon(promoVal);
    if (success) {
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try "ATELIER10" or "ATELIER20".');
    }
  };

  const handleCheckoutSimulate = () => {
    setCheckoutStep(true);
    setTimeout(() => {
      alert('Order Placed Successfully! Simulation completed. Your Atelier bag is now cleared.');
      clearCart();
      setCheckoutStep(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Page Header */}
      <div className="border-b border-border pb-6 mb-10">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-muted uppercase">
          Your Selection
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-foreground mt-2">
          Shopping Bag
        </h1>
      </div>

      {/* 1. Empty Cart State */}
      {cart.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl p-8 max-w-lg mx-auto flex flex-col items-center">
          <ShoppingBag className="w-10 h-10 text-muted stroke-[1.25] mb-6 animate-pulse" />
          <h2 className="font-serif text-xl md:text-2xl uppercase tracking-wide text-foreground mb-3">
            Your Bag is Empty
          </h2>
          <p className="text-xs md:text-sm text-muted font-medium leading-relaxed mb-8">
            You have not added any garments to your checkout list yet. Explore our latest concepts to design your structural wardrobe.
          </p>
          <Link
            href="/products"
            className="group px-8 py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-all flex items-center gap-2"
          >
            Start Curating
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      ) : (
        /* 2. Interactive Columns (List on left, summary on right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* A. Left Pane: Cart line items (7/12 width) */}
          <div className="lg:col-span-7 space-y-6">
            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="flex gap-4 border border-border p-4 rounded-2xl bg-secondary/15 hover:border-foreground/35 transition-colors"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-26 sm:w-24 sm:h-32 bg-secondary rounded-xl overflow-hidden shrink-0 relative border border-border/30">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Details Config */}
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-serif text-sm md:text-base font-semibold text-foreground line-clamp-1">
                        <Link href={`/product/${item.slug}`} className="hover:text-muted transition-colors">
                          {item.name}
                        </Link>
                      </h3>
                      
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-muted hover:text-foreground p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.5]" />
                      </button>
                    </div>

                    <div className="flex gap-4 text-[10px] text-muted font-bold tracking-wider uppercase mt-1">
                      <span>Size: <span className="text-foreground">{item.size}</span></span>
                      <span>Color: <span className="text-foreground">{item.color}</span></span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end gap-4 mt-4">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-border rounded-lg bg-background">
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                        className="px-2.5 py-1.5 text-muted hover:text-foreground"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3 stroke-[1.5]" />
                      </button>
                      <span className="px-2 text-xs font-bold w-8 text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-muted hover:text-foreground"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3 stroke-[1.5]" />
                      </button>
                    </div>

                    {/* Cost values */}
                    <div className="text-sm font-semibold tracking-wide">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {/* B. Right Pane: Pricing Summary Cards (5/12 width) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Promo Codes Application Form */}
            <div className="border border-border p-6 rounded-2xl bg-secondary/15">
              <span className="text-[9px] tracking-[0.2em] font-semibold text-muted uppercase block mb-3">
                Atelier Promotion
              </span>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoVal}
                  onChange={(e) => setPromoVal(e.target.value)}
                  placeholder="PROMO CODE..."
                  disabled={!!couponCode}
                  className="flex-grow px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                  aria-label="Coupon code input"
                  id="promo-code-input"
                />
                {couponCode ? (
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon();
                      setPromoVal('');
                    }}
                    className="px-4 py-2.5 border border-border hover:border-foreground text-foreground text-xs font-bold uppercase tracking-widest rounded-xl"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
                  >
                    Apply
                  </button>
                )}
              </form>
              
              {/* Promo validation notifications */}
              {promoError && <p className="text-[10px] text-red-500 font-medium mt-2">{promoError}</p>}
              {couponCode && (
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold mt-2">
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Promo Applied: &quot;{couponCode}&quot; ({discountPercent}% Discount)</span>
                </div>
              )}

              {/* Informative Swatch Tips */}
              <div className="flex gap-1.5 items-start mt-4 pt-4 border-t border-border/40 text-[10px] text-muted">
                <HelpCircle className="w-3.5 h-3.5 shrink-0 stroke-[1.5]" />
                <p>
                  Use the exclusive demo promo codes <strong className="text-foreground">ATELIER10</strong> or <strong className="text-foreground">ATELIER20</strong> to test reductions in real time!
                </p>
              </div>
            </div>

            {/* Calculations Card */}
            <div className="border border-border p-6 rounded-2xl bg-secondary/15 space-y-4">
              <span className="text-[9px] tracking-[0.2em] font-semibold text-muted uppercase block">
                Pricing Summary
              </span>

              <div className="space-y-2 text-xs font-medium text-muted font-sans border-b border-border pb-4">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="text-foreground font-semibold">{formatCurrency(getSubtotal())}</span>
                </div>
                
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatCurrency(getDiscountAmount())}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-foreground font-semibold">
                    {getShipping() === 0 ? 'Complimentary' : formatCurrency(getShipping())}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-end font-serif text-lg font-normal uppercase py-2">
                <span>Grand Total</span>
                <span className="text-xl font-bold tracking-wide text-foreground">
                  {formatCurrency(getTotal())}
                </span>
              </div>

              {/* simulated checkout action buttons */}
              <button
                onClick={handleCheckoutSimulate}
                disabled={checkoutStep}
                className="w-full py-4 bg-foreground text-background dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                id="cart-checkout-button"
              >
                {checkoutStep ? 'Securing Transaction...' : 'Proceed to Checkout'}
                {!checkoutStep && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Sticky Bottom mobile checkout panel */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-background/90 backdrop-blur border-t border-border p-3 flex gap-4 shadow-lg justify-between items-center">
          <div className="flex flex-col justify-center">
            <span className="text-[9px] uppercase tracking-wider text-muted font-semibold">Total Price</span>
            <span className="font-serif text-lg font-bold text-foreground">
              {formatCurrency(getTotal())}
            </span>
          </div>
          <button
            onClick={handleCheckoutSimulate}
            disabled={checkoutStep}
            className="px-6 py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center gap-2 shadow-md disabled:opacity-50 shrink-0"
          >
            {checkoutStep ? 'Processing...' : 'Checkout'}
            {!checkoutStep && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

    </div>
  );
}
