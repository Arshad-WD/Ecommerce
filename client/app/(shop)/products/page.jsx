'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { products, categories } from '@/lib/mock-data';
import ProductGrid from '@/components/products/ProductGrid';
import { SlidersHorizontal, ArrowDownAZ, X } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 1. Read URL States
  const urlCategory = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';

  // 2. Local State Management
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchVal, setSearchVal] = useState(urlSearch);

  // Sync state with URL params
  useEffect(() => {
    setSelectedCategory(urlCategory);
  }, [urlCategory]);

  useEffect(() => {
    setSearchVal(urlSearch);
  }, [urlSearch]);

  // All sizes available in luxury store
  const allSizes = ['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', '36'];
  // All neutral colors in store
  const allColors = ['Black', 'Off-White', 'Cream', 'Charcoal'];

  // 3. Filtering and Sorting Calculations
  useEffect(() => {
    let result = [...products];

    // Filter by Category
    if (selectedCategory) {
      result = result.filter((prod) => prod.category === selectedCategory);
    }

    // Filter by Search Keystrokes
    if (searchVal) {
      result = result.filter(
        (prod) =>
          prod.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          prod.description.toLowerCase().includes(searchVal.toLowerCase())
      );
    }

    // Filter by Size Selection
    if (selectedSize) {
      result = result.filter((prod) => prod.sizes.includes(selectedSize));
    }

    // Filter by Color Selection
    if (selectedColor) {
      result = result.filter((prod) => prod.colors.includes(selectedColor));
    }

    // Apply Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'featured') {
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchVal, selectedSize, selectedColor, sortBy]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedSize('');
    setSelectedColor('');
    setSortBy('featured');
    setSearchVal('');
    router.push('/products');
  };

  const handleCategorySelect = (slug) => {
    const newCat = selectedCategory === slug ? '' : slug;
    setSelectedCategory(newCat);
    if (newCat) {
      router.push(`/products?category=${newCat}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Page Header */}
      <div className="border-b border-border pb-6 mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <span className="text-[10px] tracking-[0.2em] font-semibold text-muted uppercase">
            Atelier Catalog
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-foreground mt-2">
            The Collection
          </h1>
        </div>

        {/* Global Catalog Search Input */}
        <div className="flex gap-3 max-w-sm w-full md:ml-auto">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search catalog..."
            className="w-full px-4 py-2.5 bg-secondary/40 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
            id="catalog-search-input"
          />
        </div>
      </div>

      {/* Grid structure with Sidebar Filters */}
      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* A. Desktop Sidebar Filters (Hidden on smaller screens) */}
        <aside className="hidden lg:block w-60 shrink-0 space-y-8">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-border pb-3">
            <span className="text-[10px] tracking-[0.25em] font-bold text-foreground uppercase">
              Filter Options
            </span>
            {(selectedCategory || selectedSize || selectedColor || searchVal) && (
              <button
                onClick={clearFilters}
                className="text-[9px] uppercase tracking-widest text-muted hover:text-foreground font-bold hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-[10px] tracking-wider uppercase font-bold text-muted">Categories</h4>
            <ul className="space-y-2 text-xs font-semibold">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => handleCategorySelect(cat.slug)}
                    className={`w-full text-left py-1 hover:text-foreground transition-colors flex justify-between items-center ${
                      selectedCategory === cat.slug ? 'text-foreground font-bold underline underline-offset-4' : 'text-foreground/70'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-muted font-normal">({cat.count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sizes */}
          <div className="space-y-3 pt-3 border-t border-border/40">
            <h4 className="text-[10px] tracking-wider uppercase font-bold text-muted">Size</h4>
            <div className="flex gap-2 flex-wrap">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                  className={`px-3 py-2 border rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                    selectedSize === size
                      ? 'bg-foreground text-background border-foreground dark:bg-white dark:text-neutral-900'
                      : 'border-border text-foreground hover:border-foreground/40'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3 pt-3 border-t border-border/40">
            <h4 className="text-[10px] tracking-wider uppercase font-bold text-muted">Color</h4>
            <div className="flex gap-2 flex-wrap">
              {allColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                  className={`px-3 py-2 border rounded-lg text-[10px] font-bold tracking-wider transition-all flex items-center gap-1.5 ${
                    selectedColor === color
                      ? 'bg-foreground text-background border-foreground dark:bg-white dark:text-neutral-900'
                      : 'border-border text-foreground hover:border-foreground/40'
                  }`}
                >
                  {/* Miniature swatch indicator */}
                  <span
                    className={`w-2.5 h-2.5 rounded-full border border-neutral-300 dark:border-neutral-700 ${
                      color === 'Black' ? 'bg-black' :
                      color === 'Off-White' ? 'bg-[#FAF9F6]' :
                      color === 'Cream' ? 'bg-[#FFFDD0]' :
                      color === 'Charcoal' ? 'bg-[#36454F]' : 'bg-transparent'
                    }`}
                  />
                  {color}
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* B. Action Buttons & Grid Workspace (Right Panel) */}
        <div className="flex-1 space-y-6">
          
          {/* Mobile filter toggles / Sorting row */}
          <div className="flex justify-between items-center border border-border p-4 rounded-xl bg-secondary/20">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-foreground border border-border px-4 py-2.5 rounded-xl hover:bg-secondary bg-background"
              id="mobile-filters-trigger"
            >
              <SlidersHorizontal className="w-4 h-4 stroke-[1.5]" />
              Filters
            </button>

            <span className="hidden lg:inline text-xs text-muted font-medium">
              Showing {filteredProducts.length} of {products.length} Garments
            </span>

            {/* Sorting Selection Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowDownAZ className="w-4 h-4 text-muted stroke-[1.5]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-[10px] font-bold tracking-widest uppercase focus:outline-none border-none py-1 text-foreground cursor-pointer appearance-none pr-4"
                id="sorting-select-dropdown"
              >
                <option className="bg-background text-foreground text-xs font-semibold py-2" value="featured">Featured First</option>
                <option className="bg-background text-foreground text-xs font-semibold py-2" value="price-low">Price: Low to High</option>
                <option className="bg-background text-foreground text-xs font-semibold py-2" value="price-high">Price: High to Low</option>
                <option className="bg-background text-foreground text-xs font-semibold py-2" value="rating">Rating Overview</option>
              </select>
            </div>
          </div>

          {/* Product Items Display Grid */}
          <ProductGrid products={filteredProducts} />

        </div>
      </div>

      {/* C. Mobile Filters Overlay Panel Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col pt-6 px-6 pb-20 animate-fade-in lg:hidden">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-border pb-4 mb-6">
            <span className="font-serif text-lg font-semibold uppercase tracking-wide text-foreground">
              Filter Options
            </span>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="p-2 border border-border rounded-full hover:border-foreground"
              aria-label="Close filters panel"
              id="mobile-filters-close-btn"
            >
              <X className="w-4 h-4 text-foreground stroke-[1.5]" />
            </button>
          </div>

          {/* Scrolling Content */}
          <div className="flex-grow overflow-y-auto space-y-8 pr-1">
            {/* Categories */}
            <div className="space-y-3">
              <h4 className="text-[10px] tracking-wider uppercase font-bold text-muted">Categories</h4>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategorySelect(cat.slug);
                    }}
                    className={`p-3 border rounded-xl text-xs font-bold tracking-wider transition-all text-left ${
                      selectedCategory === cat.slug
                        ? 'bg-foreground text-background border-foreground dark:bg-white dark:text-neutral-900 shadow-sm'
                        : 'border-border text-foreground/80 bg-secondary/30'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              <h4 className="text-[10px] tracking-wider uppercase font-bold text-muted">Sizes</h4>
              <div className="flex gap-2 flex-wrap">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                    className={`w-10 h-10 border rounded-xl text-[10px] font-bold tracking-wider transition-all flex items-center justify-center ${
                      selectedSize === size
                        ? 'bg-foreground text-background border-foreground dark:bg-white dark:text-neutral-900'
                        : 'border-border text-foreground hover:border-foreground/45 bg-secondary/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3 pt-4 border-t border-border/40">
              <h4 className="text-[10px] tracking-wider uppercase font-bold text-muted">Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                {allColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                    className={`p-3 border rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 ${
                      selectedColor === color
                        ? 'bg-foreground text-background border-foreground dark:bg-white dark:text-neutral-900 shadow-sm'
                        : 'border-border text-foreground bg-secondary/30'
                    }`}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full border border-neutral-300 dark:border-neutral-700 ${
                        color === 'Black' ? 'bg-black' :
                        color === 'Off-White' ? 'bg-[#FAF9F6]' :
                        color === 'Cream' ? 'bg-[#FFFDD0]' :
                        color === 'Charcoal' ? 'bg-[#36454F]' : 'bg-transparent'
                      }`}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-border mt-6 flex gap-3">
            <button
              onClick={() => {
                clearFilters();
                setShowMobileFilters(false);
              }}
              className="flex-1 py-3.5 border border-border text-foreground text-xs uppercase tracking-widest font-bold rounded-xl hover:bg-secondary transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="flex-1 py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              Apply Filters
            </button>
          </div>

        </div>
      )}

    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-serif text-lg italic text-muted">
        Loading Atelier Collection...
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
