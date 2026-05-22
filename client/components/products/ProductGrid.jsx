'use client';

import ProductCard from './ProductCard';

export default function ProductGrid({ products, isLoading = false }) {
  
  // 1. Loading Skeleton Grid
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col w-full h-full animate-pulse">
            <div className="aspect-[3/4] w-full bg-secondary rounded-xl mb-4" />
            <div className="h-3 w-16 bg-secondary rounded mb-2" />
            <div className="h-4 w-full bg-secondary rounded mb-2" />
            <div className="h-3 w-12 bg-secondary rounded mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Empty Grid State
  if (products.length === 0) {
    return (
      <div className="w-full text-center py-20 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center p-6">
        <span className="font-serif text-lg italic text-muted mb-2">No garments found</span>
        <p className="text-xs text-muted max-w-xs leading-relaxed">
          Adjust your active filters or clear search query to inspect our core seasonal catalog.
        </p>
      </div>
    );
  }

  // 3. Complete Loaded Products Grid
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
