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

export interface SavedItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface SavedStore {
  items: SavedItem[];
  addSaved: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeSaved: (productId: string) => void;
  clearSaved: () => void;
}

export const useSavedStore = create<SavedStore>()(
  persist(
    (set) => ({
      items: [],
      addSaved: (product, size, color, quantity = 1) =>
        set((state) => {
          const exists = state.items.find(
            (i) => i.id === product.id && i.selectedSize === size && i.selectedColor === color
          );
          if (exists) {
            return {
              items: state.items.map((i) =>
                i.id === product.id && i.selectedSize === size && i.selectedColor === color
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          const newItem: SavedItem = {
            ...product,
            quantity,
            selectedSize: size,
            selectedColor: color,
          };
          return { items: [newItem, ...state.items] };
        }),
      removeSaved: (productId: string) => set((state) => ({ items: state.items.filter((i) => i.id !== productId) })),
      clearSaved: () => set({ items: [] }),
    }),
    { name: 'saved-for-later' }
  )
);









