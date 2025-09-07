import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecentStore {
  recentIds: string[];
  addRecent: (id: string) => void;
  clearRecent: () => void;
}

export const useRecentStore = create<RecentStore>()(
  persist(
    (set, get) => ({
      recentIds: [],
      addRecent: (id: string) => {
        set((state) => {
          const withoutId = state.recentIds.filter((x) => x !== id);
          const updated = [id, ...withoutId].slice(0, 8);
          return { recentIds: updated };
        });
      },
      clearRecent: () => set({ recentIds: [] }),
    }),
    { name: 'recent-products' }
  )
);









