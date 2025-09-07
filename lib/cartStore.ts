import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemOptions: (productId: string, size?: string, color?: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, size?: string, color?: string) => {
        set((state) => {
          const existingItem = state.items.find(
            item => item.id === product.id && 
            item.selectedSize === size && 
            item.selectedColor === color
          );

          if (existingItem) {
            // Update quantity if item already exists with same options
            return {
              items: state.items.map(item =>
                item.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor === color
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            // Add new item
            const newItem: CartItem = {
              ...product,
              quantity: 1,
              selectedSize: size,
              selectedColor: color
            };
            return { items: [...state.items, newItem] };
          }
        });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, quantity }
              : item
          )
        }));
      },

      updateItemOptions: (productId: string, size?: string, color?: string) => {
        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, selectedSize: size, selectedColor: color }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price = parseFloat(item.price.replace('$', '').replace(',', ''));
          return total + (price * item.quantity);
        }, 0);
      },

      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
);
