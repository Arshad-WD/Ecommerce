'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { products, reviews as mockReviews } from '@/lib/mock-data';
import { useShop } from '@/lib/ShopContext';
import ProductGallery from '@/components/products/ProductGallery';
import ProductCard from '@/components/products/ProductCard';
import Accordion from '@/components/shared/Accordion';
import { formatCurrency } from '@/lib/utils';
import { Heart, ShoppingBag, Star, ArrowLeft, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { productApi } from '@/lib/api';

export default function ProductDetailsPage() {
  const params = useParams();
  const { slug } = params;
  
  // Refactor: Move from mock `find` to actual unified api state
  const { cart, wishlist, toggleWishlist, addToCart } = useShop();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  // 2. Local Customization States
  const [selectedSize, setSelectedSize] = useState('M'); // default fallback
  const [selectedColor, setSelectedColor] = useState('Black'); // default fallback
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const res = await productApi.getProductDetails(slug);
        const fetchedProduct = res?.data || res;
        
        if (fetchedProduct) {
          // Normalize Images: MinIO returns { id, url }, Map to strings
          let normalizedImages = [];
          if (fetchedProduct.images && Array.isArray(fetchedProduct.images)) {
             normalizedImages = fetchedProduct.images.map(img => typeof img === 'object' && img !== null ? (img.imageUrl || img.url) : img);
          }
          if (normalizedImages.length === 0) {
            normalizedImages = ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop']; // Fallback placeholder
          }
          fetchedProduct.images = normalizedImages;

          // Normalize sizes/colors structurally if backend schema is limited
          fetchedProduct.sizes = fetchedProduct.sizes || ['S', 'M', 'L', 'XL'];
          fetchedProduct.colors = fetchedProduct.colors || ['Black', 'Off-White'];

          setProduct(fetchedProduct);
          setSelectedSize(fetchedProduct.sizes[0]);
          setSelectedColor(fetchedProduct.colors[0]);

          // Optional: Fetch related items by category
          const catId = typeof fetchedProduct.category === 'object' ? fetchedProduct.category?.id : fetchedProduct.categoryId;
          if (catId) {
             const relatedRes = await productApi.listProducts({ category: catId, limit: 5 });
             const relList = relatedRes?.products || relatedRes?.data?.products || [];
             setRelatedProducts(relList.filter(p => p.id !== fetchedProduct.id).slice(0, 4));
          }
        } else {
          setFetchError(true);
        }
      } catch (err) {
        console.error("Failed to load product details:", err);
        setFetchError(true);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
     return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-muted font-serif animate-pulse">Loading collection piece...</div>;
  }

  if (fetchError || !product) {
    notFound();
  }

  // Extract reviews for this product
  const productReviews = mockReviews.filter((rev) => rev.productId === product.id);
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 2500);
  };

  const catName = typeof product.category === 'object' && product.category !== null ? product.category.name : (product.category || 'Atelier');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Dynamic Breadcrumbs & Return link */}
      <div className="flex justify-between items-center mb-8 border-b border-border/40 pb-4 text-xs font-semibold uppercase tracking-wider text-muted">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-foreground">Atelier</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground">Collection</Link>
          <span>/</span>
          <Link href={`/products?category=${typeof product.category === 'object' ? product.category?.id : product.category}`} className="hover:text-foreground capitalize">{catName}</Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{product.name}</span>
        </div>
        <Link href="/products" className="flex items-center gap-1 hover:text-foreground shrink-0">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </div>

      {/* Main Grid: Gallery on left, detailed controls on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Campaign Photo Gallery Column (6/12 width) */}
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* Right Side: Sticky Details Config Column (5/12 width) */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          
          {/* Header titles */}
          <div className="border-b border-border pb-6 mb-6">
            <span className="text-[10px] tracking-[0.25em] font-semibold text-muted uppercase">
              {catName}
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-normal uppercase tracking-wide text-foreground mt-2 mb-3">
              {product.name}
            </h1>
            
            {/* Review rating summary */}
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground tracking-wide mt-2">
              <div className="flex text-foreground">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(product.rating || 5)
                        ? 'fill-foreground stroke-foreground dark:fill-white dark:stroke-white'
                        : 'stroke-neutral-300 dark:stroke-neutral-700'
                    }`}
                  />
                ))}
              </div>
              <span>{product.rating || "5.0"}</span>
              <span className="text-muted">({product.reviewsCount || 0} reviews)</span>
            </div>
          </div>

          {/* Pricing detail */}
          <div className="text-2xl font-serif tracking-wider mb-6">
            {product.discountPrice ? (
              <div className="flex gap-3 items-center">
                <span className="text-foreground">{formatCurrency(product.discountPrice)}</span>
                <span className="text-muted line-through text-base font-normal">
                  {formatCurrency(product.price)}
                </span>
              </div>
            ) : (
              <span>{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Item description */}
          <p className="text-sm text-muted leading-relaxed mb-8 font-medium font-sans">
            {product.description}
          </p>

          {/* Config: Color Selector */}
          <div className="space-y-3 mb-6">
            <span className="text-[10px] tracking-[0.15em] font-semibold text-muted uppercase block">
              Color: <span className="text-foreground">{selectedColor}</span>
            </span>
            <div className="flex gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    selectedColor === color
                      ? 'border-foreground ring-[0.5px] ring-foreground bg-foreground text-background dark:bg-white dark:text-neutral-900'
                      : 'border-border text-foreground hover:border-foreground/45 bg-secondary/30'
                  }`}
                >
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

          {/* Config: Size Selector */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-[0.15em] font-semibold text-muted uppercase block">
                Size: <span className="text-foreground">{selectedSize}</span>
              </span>
              <button
                onClick={() => alert('Sizing chart: Standard athletic luxury silhouettes.')}
                className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground underline font-bold"
              >
                Size Guide
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 border rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                    selectedSize === size
                      ? 'bg-foreground text-background border-foreground dark:bg-white dark:text-neutral-900 shadow-sm'
                      : 'border-border text-foreground hover:border-foreground/45 bg-secondary/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Config: Quantity Selector */}
          <div className="space-y-3 mb-8">
            <span className="text-[10px] tracking-[0.15em] font-semibold text-muted uppercase block">
              Quantity
            </span>
            <div className="flex items-center border border-border rounded-xl w-max bg-secondary/35">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-3 text-foreground/80 hover:text-foreground"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
              <span className="px-4 text-sm font-bold w-12 text-center select-none">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-3 text-foreground/80 hover:text-foreground"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[1.5]" />
              </button>
            </div>
          </div>

          {/* Checkout action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-4 bg-foreground text-background dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
              id="details-add-to-cart-btn"
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              Add to Bag
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="px-6 py-4 border border-border text-foreground hover:border-foreground rounded-xl flex items-center justify-center gap-2 transition-colors"
              aria-label="Toggle wishlist"
              id="details-wishlist-toggle"
            >
              <Heart
                className={`w-4.5 h-4.5 stroke-[1.5] ${
                  isWishlisted ? 'fill-foreground stroke-foreground dark:fill-white dark:stroke-white' : ''
                }`}
              />
              <span className="sm:hidden text-xs uppercase tracking-widest font-bold">Wishlist</span>
            </button>
          </div>

          {/* Dropdown Spec accordions */}
          <div className="border-t border-border mt-4">
            <Accordion title="Fabric & Sourcing">
              Sourced from heritage organic fabric mills. Woven with double-ply fibers for structured posture and durable resistance. Fabric weight 320gsm. Dry-cotton weave. Hand wash recommended or delicate cold cycle.
            </Accordion>
            <Accordion title="Sizing Guide">
              This garment features a slightly boxy, structural drape. Fits true to size for an architectural aesthetic. If you prefer a tighter, classical fit, we recommend selecting one size smaller.
            </Accordion>
            <Accordion title="Delivery & Returns">
              Complimentary carbon-neutral worldwide shipping on orders above $300. Orders are dispatched from New York and Paris within 48 hours. Returns are accepted within 14 days of delivery.
            </Accordion>
          </div>

        </div>
      </div>

      {/* Reviews list panel */}
      <section className="mt-24 pt-12 border-t border-border/70 max-w-4xl mx-auto">
        <h3 className="font-serif text-2xl uppercase tracking-wider text-foreground mb-8">
          Client Reviews ({productReviews.length})
        </h3>
        
        {productReviews.length > 0 ? (
          <div className="space-y-8 divide-y divide-border/60">
            {productReviews.map((rev) => (
              <div key={rev.id} className="pt-6 first:pt-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-widest text-foreground">
                      {rev.userName}
                    </h5>
                    <span className="text-[10px] text-muted font-medium">{rev.date}</span>
                  </div>
                  <div className="flex text-foreground">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < rev.rating
                            ? 'fill-foreground stroke-foreground dark:fill-white dark:stroke-white'
                            : 'stroke-neutral-300 dark:stroke-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs md:text-sm text-muted leading-relaxed font-sans font-medium">
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-serif text-base italic text-muted text-center py-10 border border-dashed border-border rounded-xl">
            No reviews yet. Be the first to share your thoughts on this garment.
          </p>
        )}
      </section>

      {/* Related Products carousel lists */}
      {relatedProducts.length > 0 && (
        <section className="mt-24 pt-12 border-t border-border/70">
          <h3 className="font-serif text-2xl md:text-3xl font-light uppercase tracking-wide text-foreground mb-10 text-center">
            Related <span className="italic font-normal">Garments</span>
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>
      )}

      {/* Success Notification Popup Toast */}
      {addedNotification && (
        <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50 bg-foreground text-background dark:bg-white dark:text-neutral-950 px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 animate-slide-up border border-border/20">
          <ShoppingBag className="w-4 h-4 stroke-[2]" />
          <div className="text-xs font-bold uppercase tracking-wider">
            Added to Bag ({quantity} qty)
          </div>
        </div>
      )}

      {/* Sticky Bottom mobile CTA container */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-30 bg-background/90 backdrop-blur border-t border-border p-3 flex gap-4 shadow-lg">
        <div className="flex-grow flex items-center justify-between px-3 py-2 bg-secondary/50 border border-border rounded-xl">
          <span className="font-serif text-sm font-bold text-foreground">
            {formatCurrency(product.discountPrice || product.price)}
          </span>
          <span className="text-[10px] text-muted tracking-wider uppercase font-semibold">
            {selectedSize} / {selectedColor}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-6 py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 font-bold text-xs uppercase tracking-widest rounded-xl hover:opacity-90 flex items-center gap-1 shadow-md shrink-0"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Add to Bag
        </button>
      </div>

    </div>
  );
}
