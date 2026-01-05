import { create } from "zustand";
import { persist } from "zustand/middleware"; // Optional: if you want to save favorites to localStorage
import { Property } from "@/components/features/properties/types/property";

interface PropertyStore {
  selectedProperty: Property | null;
  favorites: string[]; // ✅ Changed from number[] to string[]
  recentViews: string[]; // ✅ Changed from number[] to string[]

  // Actions
  setSelectedProperty: (property: Property) => void;
  clearSelectedProperty: () => void;
  toggleFavorite: (id: string) => void; // ✅ Changed id type to string
  addToRecentViews: (id: string) => void; // ✅ Changed id type to string
}

export const usePropertyStore = create<PropertyStore>()(
  persist(
    (set) => ({
      selectedProperty: null,
      favorites: [],
      recentViews: [],

      setSelectedProperty: (property) => set({ selectedProperty: property }),

      clearSelectedProperty: () => set({ selectedProperty: null }),

      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((favId) => favId !== id)
            : [...state.favorites, id],
        })),

      addToRecentViews: (id) =>
        set((state) => ({
          recentViews: [
            id,
            // Filter out if it already exists to avoid duplicates, then keep top 10
            ...state.recentViews.filter((viewId) => viewId !== id).slice(0, 9),
          ],
        })),
    }),
    {
      name: "property-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({
        favorites: state.favorites,
        recentViews: state.recentViews,
      }), // Only persist favorites and recent history, not selectedProperty
    }
  )
);
