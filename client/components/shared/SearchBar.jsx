'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { products } from '@/lib/mock-data';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '@/lib/utils';

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered.slice(0, 4));
  }, [query]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-foreground/80 hover:text-foreground transition-colors focus:outline-none"
        aria-label="Search Collection"
        id="navbar-search-trigger"
      >
        <Search className="w-[18px] h-[18px] stroke-[1.25]" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-md flex flex-col pt-24 px-6 md:px-16 animate-fade-in">
          {/* Header Close */}
          <div className="absolute top-6 right-6 md:right-16">
            <button
              onClick={() => setIsOpen(false)}
              className="p-3 text-foreground/75 hover:text-foreground transition-colors border border-border rounded-full hover:border-foreground"
              aria-label="Close search"
              id="search-close-button"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Search Input Container */}
          <div className="max-w-4xl w-full mx-auto flex flex-col flex-1">
            <div className="relative border-b border-border pb-4">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="TYPE TO SEARCH THE COLLECTION..."
                className="w-full text-2xl md:text-5xl font-serif tracking-wide bg-transparent border-none text-foreground uppercase placeholder-neutral-400 focus:outline-none"
                id="search-overlay-input"
              />
              <Search className="absolute right-0 bottom-6 w-6 h-6 md:w-8 md:h-8 text-neutral-400 stroke-[1]" />
            </div>

            {/* Results Panel */}
            <div className="mt-12 flex-1 overflow-y-auto pb-12">
              {query.trim() === '' ? (
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-4 font-semibold">Suggested Searches</h4>
                  <ul className="space-y-3">
                    {['Tailoring', 'Outerwear', 'Essentials', 'Footwear'].map((term) => (
                      <li key={term}>
                        <button
                          onClick={() => setQuery(term)}
                          className="text-lg md:text-2xl font-serif text-foreground/80 hover:text-foreground flex items-center gap-2 group transition-colors"
                        >
                          {term}
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : results.length > 0 ? (
                <div>
                  <h4 className="text-xs uppercase tracking-[0.2em] text-muted mb-6 font-semibold">Matching Products</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {results.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="flex gap-4 border border-border p-4 rounded-xl hover:border-foreground/40 transition-all duration-300 bg-secondary/30"
                      >
                        <div className="w-20 h-24 relative overflow-hidden rounded-lg bg-secondary shrink-0">
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-muted font-medium">
                              {product.category}
                            </span>
                            <h5 className="font-serif text-base text-foreground mt-0.5 line-clamp-1">
                              {product.name}
                            </h5>
                          </div>
                          <div className="text-sm font-semibold tracking-wide">
                            {product.discountPrice ? (
                              <div className="flex gap-2 items-center">
                                <span className="text-foreground">{formatCurrency(product.discountPrice)}</span>
                                <span className="text-muted line-through text-xs font-normal">
                                  {formatCurrency(product.price)}
                                </span>
                              </div>
                            ) : (
                              <span>{formatCurrency(product.price)}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="font-serif text-xl text-muted italic">No items found matching &quot;{query}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
