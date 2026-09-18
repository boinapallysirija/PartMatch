import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartModel } from '../types';
import { cartService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartToast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'danger';
}

interface CartContextType {
  cart: CartModel | null;
  loading: boolean;
  cartCount: number;
  toasts: CartToast[];
  removeToast: (id: string) => void;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  bulkAddToCart: (items: { productId: number; quantity?: number }[]) => Promise<number>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toasts, setToasts] = useState<CartToast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'danger' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshCart = useCallback(async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart, user]);

  const addToCart = async (productId: number, quantity: number = 1) => {
    setLoading(true);
    try {
      const updated = await cartService.addToCart(productId, quantity);
      setCart(updated);
      addToast('Added component to cart!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to add item', 'danger');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const bulkAddToCart = async (items: { productId: number; quantity?: number }[]): Promise<number> => {
    setLoading(true);
    try {
      const res = await cartService.bulkAddToCart(items);
      setCart(res.cart);
      if (res.addedCount > 0) {
        addToast(`Successfully added ${res.addedCount} missing components to your cart!`, 'success');
      } else {
        addToast('No components were added (out of stock or unavailable)', 'info');
      }
      return res.addedCount;
    } catch (err: any) {
      addToast(err.message || 'Failed to add components', 'danger');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      const updated = await cartService.updateCartItem(cartItemId, quantity);
      setCart(updated);
    } catch (err: any) {
      addToast(err.message || 'Failed to update quantity', 'danger');
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const updated = await cartService.removeCartItem(cartItemId);
      setCart(updated);
      addToast('Removed item from cart', 'info');
    } catch (err: any) {
      addToast(err.message || 'Failed to remove item', 'danger');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      await refreshCart();
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
    }
  };

  const cartCount = cart?.totalItems || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        toasts,
        removeToast,
        refreshCart,
        addToCart,
        bulkAddToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
