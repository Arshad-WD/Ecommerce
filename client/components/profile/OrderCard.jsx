'use client';

import { formatCurrency } from '@/lib/utils';
import { Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function OrderCard({ order }) {
  const { id, date, status, total, paymentMethod, items, shippingAddress } = order;

  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-background hover:border-foreground/30 transition-colors duration-300">
      
      {/* 1. Order summary banner */}
      <div className="bg-secondary/40 border-b border-border px-6 py-4 flex flex-col sm:flex-row justify-between gap-4 text-xs font-semibold uppercase tracking-wider text-muted">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-x-8 gap-y-2">
          <div>
            <span className="text-[10px] block text-muted/80">Order Placed</span>
            <span className="text-foreground mt-0.5 block">{date}</span>
          </div>
          <div>
            <span className="text-[10px] block text-muted/80">Total Amount</span>
            <span className="text-foreground mt-0.5 block font-bold">{formatCurrency(total)}</span>
          </div>
          <div>
            <span className="text-[10px] block text-muted/80">Order Identifier</span>
            <span className="text-foreground mt-0.5 block">{id}</span>
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <span className="text-[10px] block text-muted/80">Payment Method</span>
          <span className="text-foreground mt-0.5 block">{paymentMethod}</span>
        </div>
      </div>

      {/* 2. Order line items details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-muted stroke-[1.5]" />
            <span className="text-xs uppercase tracking-widest font-bold text-foreground">
              Status: <span className="underline underline-offset-4">{status}</span>
            </span>
          </div>
          <span className="text-[10px] uppercase text-muted tracking-wider">
            {items.length} {items.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <div className="divide-y divide-border/45">
          {items.map((item) => (
            <div key={item.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
              <div className="w-14 h-18 bg-secondary rounded-lg overflow-hidden shrink-0 relative border border-border/30">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-sm font-semibold text-foreground line-clamp-1">
                    {item.name}
                  </h4>
                  <div className="flex gap-4 text-[10px] text-muted tracking-wide uppercase mt-1 font-medium">
                    <span>Size: {item.size}</span>
                    <span>Color: {item.color}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="text-xs font-semibold tracking-wide self-start mt-1">
                  {formatCurrency(item.price)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shipping address details */}
        <div className="mt-6 pt-4 border-t border-border/50 text-[11px] text-muted leading-relaxed font-medium">
          <span className="uppercase tracking-[0.15em] text-foreground font-bold block mb-1.5">
            Shipping Address
          </span>
          <p>
            {shippingAddress.street}, {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}, {shippingAddress.country}
          </p>
        </div>
      </div>
    </div>
  );
}
