'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

// Helper: wipe all auth data from localStorage
function clearAuthStorage() {
  localStorage.removeItem('atelier_token');
  localStorage.removeItem('atelier_user');
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore cart/wishlist from localStorage, then VERIFY the session
  // token against the backend before trusting it. Stale tokens are purged.
  useEffect(() => {
    const initSession = async () => {
      try {
        const storedCart = localStorage.getItem('atelier_cart');
        const storedWishlist = localStorage.getItem('atelier_wishlist');
        const storedToken = localStorage.getItem('atelier_token');

        if (storedCart) {
          try { setCart(JSON.parse(storedCart)); } catch (e) { /* ignore */ }
        }
        if (storedWishlist) {
          try { setWishlist(JSON.parse(storedWishlist)); } catch (e) { /* ignore */ }
        }

        // Only attempt session restore if a token exists
        if (storedToken) {
          try {
            const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_BASE}/auth/me`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${storedToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

            if (res.ok) {
              const data = await res.json();
              // Accept both {data: user} and flat user response shapes
              const verifiedUser = data?.data || data;
              if (verifiedUser && verifiedUser.id) {
                // Token is valid — sync localStorage with fresh server data
                localStorage.setItem('atelier_user', JSON.stringify(verifiedUser));
                setUser(verifiedUser);
              } else {
                // Unexpected response shape — treat as invalid
                clearAuthStorage();
              }
            } else {
              // 401 or any other error — token is invalid/expired, purge it
              console.warn('Session token invalid, clearing auth data.');
              clearAuthStorage();
            }
          } catch (networkError) {
            // Backend unreachable — fail safe: do NOT trust localStorage user
            console.warn('Could not verify session with backend:', networkError.message);
            clearAuthStorage();
          }
        } else {
          // No token at all — ensure user data is also cleared (defensive)
          localStorage.removeItem('atelier_user');
        }
      } catch (e) {
        console.error('Session init error:', e);
        clearAuthStorage();
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  // Save cart changes to localStorage
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('atelier_cart', JSON.stringify(newCart));
  };

  // Save wishlist changes to localStorage
  const saveWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('atelier_wishlist', JSON.stringify(newWishlist));
  };

  // Add item to cart
  const addToCart = (product, size, color, quantity = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      saveCart(updatedCart);
    } else {
      const cartItem = {
        cartItemId: `${product.id}-${size}-${color}-${Date.now()}`,
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.discountPrice || product.price,
        originalPrice: product.price,
        size,
        color,
        quantity,
        image: product.images[0],
        category: product.category,
      };
      saveCart([...cart, cartItem]);
    }
  };

  // Remove item from cart
  const removeFromCart = (cartItemId) => {
    const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId);
    saveCart(updatedCart);
  };

  // Update item quantity
  const updateCartQuantity = (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    );
    saveCart(updatedCart);
  };

  // Toggle items in wishlist
  const toggleWishlist = (productId) => {
    let updatedWishlist;
    if (wishlist.includes(productId)) {
      updatedWishlist = wishlist.filter((id) => id !== productId);
    } else {
      updatedWishlist = [...wishlist, productId];
    }
    saveWishlist(updatedWishlist);
  };

  // Apply elegant minimalist discount coupons
  const applyCoupon = (code) => {
    const uppercaseCode = code.toUpperCase().trim();
    setCouponCode(uppercaseCode);
    if (uppercaseCode === 'ATELIER10') {
      setDiscountPercent(10);
      return true;
    } else if (uppercaseCode === 'ATELIER20') {
      setDiscountPercent(20);
      return true;
    }
    setDiscountPercent(0);
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setDiscountPercent(0);
  };

  // Calculate cart pricing totals
  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * discountPercent) / 100;
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 300 ? 0 : 25; // Luxury shipping fee or complimentary above $300
  };

  const getTotal = () => {
    return getSubtotal() - getDiscountAmount() + getShipping();
  };

  // Clear cart on checkout simulator
  const clearCart = () => {
    saveCart([]);
    removeCoupon();
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        loading,
        couponCode,
        discountPercent,
        searchQuery,
        setSearchQuery,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        getSubtotal,
        getDiscountAmount,
        getShipping,
        getTotal,
        clearCart,
        setUser,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
