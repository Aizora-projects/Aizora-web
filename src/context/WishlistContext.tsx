'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface WishlistContextType {
  items: string[];
  isLoading: boolean;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
}

const dummyValue: WishlistContextType = {
  items: [],
  isLoading: false,
  toggleWishlist: () => {},
  isInWishlist: () => false,
  itemCount: 0,
};

const WishlistContext = createContext<WishlistContextType>(dummyValue);

export function WishlistProvider({ children }: { children: ReactNode }) {
  return (
    <WishlistContext.Provider value={dummyValue}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}

