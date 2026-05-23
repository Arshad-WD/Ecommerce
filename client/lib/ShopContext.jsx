'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Load cart, wishlist and user session on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('atelier_cart');
      const storedWishlist = localStorage.getItem('atelier_wishlist');
      
      if (storedCart) {
        try {
          setCart(JSON.parse(storedCart));
        } catch (e) {
          console.error('Error loading cart', e);
        }
      }
      
      if (storedWishlist) {
        try {
          setWishlist(JSON.parse(storedWishlist));
        } catch (e) {
          console.error('Error loading wishlist', e);
        }
      }

      // Check if user is logged in via token
      const token = localStorage.getItem('atelier_token');
      if (token) {
        import('./api').then(({ authApi, cartApi }) => {
          authApi.getMe()
            .then((userData) => {
              setUser(userData);
              // Fetch user's cart from backend and sync it!
              cartApi.getCart().then((res) => {
                if (res.success && res.data) {
                  const mappedCart = res.data.items.map(item => ({
                    cartItemId: item.id,
                    id: item.productId,
                    name: item.product.name,
                    slug: item.product.slug,
                    price: item.product.discountPrice ? Number(item.product.discountPrice) : Number(item.product.price),
                    originalPrice: Number(item.product.price),
                    size: 'M', // Fallback since db cart doesn't save size
                    color: 'Black', // Fallback since db cart doesn't save color
                    quantity: item.quantity,
                    image: item.product.images && item.product.images.length > 0 ? item.product.images[0].imageUrl : '',
                    category: item.product.categoryId
                  }));
                  setCart(mappedCart);
                  localStorage.setItem('atelier_cart', JSON.stringify(mappedCart));
                }
              }).catch(err => console.error('Error syncing cart on mount:', err));
            })
            .catch((e) => {
              console.error('Session restored fail:', e);
              localStorage.removeItem('atelier_token');
              localStorage.removeItem('atelier_user');
              localStorage.removeItem('atelier_refresh_token');
              setUser(null);
            })
            .finally(() => {
              setSessionLoading(false);
            });
        });
      } else {
        setUser(null);
        setSessionLoading(false);
      }
    }
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

  // User Actions
  const login = async (email, password) => {
    const { authApi, cartApi } = await import('./api');
    const res = await authApi.login({ email, password });
    if (res.success && res.user) {
      setUser(res.user);
      // Fetch backend cart on login
      try {
        const cartRes = await cartApi.getCart();
        if (cartRes.success && cartRes.data) {
          const mappedCart = cartRes.data.items.map(item => ({
            cartItemId: item.id,
            id: item.productId,
            name: item.product.name,
            slug: item.product.slug,
            price: item.product.discountPrice ? Number(item.product.discountPrice) : Number(item.product.price),
            originalPrice: Number(item.product.price),
            size: 'M',
            color: 'Black',
            quantity: item.quantity,
            image: item.product.images && item.product.images.length > 0 ? item.product.images[0].imageUrl : '',
            category: item.product.categoryId
          }));
          setCart(mappedCart);
          localStorage.setItem('atelier_cart', JSON.stringify(mappedCart));
        }
      } catch (e) {
        console.error('Sync cart error on login:', e);
      }
      return { success: true };
    }
    return res;
  };

  const signup = async (name, email, password) => {
    const { authApi } = await import('./api');
    const res = await authApi.signup({ name, email, password });
    if (res.success && res.user) {
      setUser(res.user);
      setCart([]);
      localStorage.setItem('atelier_cart', JSON.stringify([]));
      return { success: true };
    }
    return res;
  };

  const logout = async () => {
    const { authApi } = await import('./api');
    await authApi.logout();
    setUser(null);
    setCart([]);
    localStorage.removeItem('atelier_cart');
  };

  // Add item to cart
  const addToCart = async (product, size, color, quantity = 1) => {
    const existingIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === size && item.color === color
    );

    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      const cartItem = {
        cartItemId: `${product.id}-${size}-${color}-${Date.now()}`,
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.discountPrice ? Number(product.discountPrice) : Number(product.price),
        originalPrice: Number(product.price),
        size,
        color,
        quantity,
        image: product.images ? product.images[0] : '',
        category: product.category,
      };
      updatedCart.push(cartItem);
    }
    saveCart(updatedCart);

    if (localStorage.getItem('atelier_token')) {
      try {
        const { cartApi } = await import('./api');
        await cartApi.addToCart(product.id, size, color, quantity);
      } catch (e) {
        console.error('Add item to backend cart fail:', e);
      }
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId) => {
    const itemToRemove = cart.find(item => item.cartItemId === cartItemId || item.id === cartItemId);
    const updatedCart = cart.filter((item) => item.cartItemId !== cartItemId && item.id !== cartItemId);
    saveCart(updatedCart);

    if (localStorage.getItem('atelier_token') && itemToRemove) {
      try {
        const { cartApi } = await import('./api');
        await cartApi.removeFromCart(itemToRemove.id);
      } catch (e) {
        console.error('Remove item from backend cart fail:', e);
      }
    }
  };

  // Update item quantity
  const updateCartQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const itemToUpdate = cart.find(item => item.cartItemId === cartItemId || item.id === cartItemId);
    const updatedCart = cart.map((item) =>
      (item.cartItemId === cartItemId || item.id === cartItemId) ? { ...item, quantity } : item
    );
    saveCart(updatedCart);

    if (localStorage.getItem('atelier_token') && itemToUpdate) {
      try {
        const { cartApi } = await import('./api');
        await cartApi.updateCartItemQty(itemToUpdate.id, quantity);
      } catch (e) {
        console.error('Update item qty in backend cart fail:', e);
      }
    }
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
  const clearCart = async () => {
    saveCart([]);
    removeCoupon();
    if (localStorage.getItem('atelier_token')) {
      try {
        const { cartApi } = await import('./api');
        await cartApi.clearCart();
      } catch (e) {
        console.error('Clear backend cart fail:', e);
      }
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        user,
        sessionLoading,
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
        login,
        signup,
        logout,
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
