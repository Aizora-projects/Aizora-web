'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';

interface WishlistContextType {
  items: string[]; // product IDs
  isLoading: boolean;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'aizora-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check auth and load wishlist
  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setUserId(user.id);
        // Load from Supabase
        const { data } = await supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', user.id);

        if (data) {
          setItems(data.map((w) => w.product_id));
        }
      } else {
        // Load from localStorage for guests
        try {
          const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
          if (stored) {
            setItems(JSON.parse(stored));
          }
        } catch {
          // Ignore
        }
      }
      setIsLoaded(true);
    }

    init();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserId(session.user.id);
        // Merge local wishlist to Supabase
        const localItems = items;
        if (localItems.length > 0) {
          for (const productId of localItems) {
            await supabase
              .from('wishlists')
              .upsert({ user_id: session.user.id, product_id: productId }, { onConflict: 'user_id,product_id' });
          }
          localStorage.removeItem(WISHLIST_STORAGE_KEY);
        }
        // Reload from Supabase
        const { data } = await supabase
          .from('wishlists')
          .select('product_id')
          .eq('user_id', session.user.id);
        if (data) {
          setItems(data.map((w) => w.product_id));
        }
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setItems([]);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist guest wishlist to localStorage
  useEffect(() => {
    if (isLoaded && !userId) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoaded, userId]);

  const toggleWishlist = useCallback(async (productId: string) => {
    const supabase = createClient();
    const isInList = items.includes(productId);

    if (isInList) {
      setItems((prev) => prev.filter((id) => id !== productId));
      if (userId) {
        await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', userId)
          .eq('product_id', productId);
      }
    } else {
      setItems((prev) => [...prev, productId]);
      if (userId) {
        await supabase
          .from('wishlists')
          .insert({ user_id: userId, product_id: productId });
      }
    }
  }, [items, userId]);

  const isInWishlist = useCallback(
    (productId: string) => items.includes(productId),
    [items]
  );

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        toggleWishlist,
        isInWishlist,
        itemCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
