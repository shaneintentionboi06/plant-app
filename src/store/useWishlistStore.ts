import { create } from 'zustand';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (plantId: string) => void;
  isWishlisted: (plantId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistIds: ['monstera-deliciosa', 'staghorn-fern', 'olive-tree'],

  toggleWishlist: (plantId) => {
    set((state) => {
      const exists = state.wishlistIds.includes(plantId);
      return {
        wishlistIds: exists
          ? state.wishlistIds.filter((id) => id !== plantId)
          : [...state.wishlistIds, plantId],
      };
    });
  },

  isWishlisted: (plantId) => {
    return get().wishlistIds.includes(plantId);
  },
}));
