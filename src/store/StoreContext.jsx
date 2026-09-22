import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Client-side cart + wishlist backed by localStorage.
 *
 * Items are stored as snapshots of the backend product object (id, name,
 * brand, category, price, oldPrice, discount, image, specifications) plus a
 * quantity. The frontend never invents products: snapshots only ever come
 * from products returned by the API. There is no dedicated cart table in the
 * backend yet, so persistence lives here.
 */

const CART_KEY = "sd_cart";
const WISHLIST_KEY = "sd_wishlist";

const StoreContext = createContext(null);

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => readList(CART_KEY));
  const [wishlist, setWishlist] = useState(() => readList(WISHLIST_KEY));

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch {
      /* storage full / unavailable — keep in-memory state */
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch {
      /* storage full / unavailable — keep in-memory state */
    }
  }, [wishlist]);

  const addToCart = useCallback((product, qty = 1) => {
    setCartItems((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      return [...current, { ...product, qty }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCartItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id, change) => {
    setCartItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const toggleWishlist = useCallback((product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      return exists
        ? current.filter((item) => item.id !== product.id)
        : [...current, product];
    });
  }, []);

  const isWishlisted = useCallback(
    (id) => wishlist.some((item) => item.id === id),
    [wishlist]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount: cartItems.reduce((sum, item) => sum + item.qty, 0),
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      isWishlisted,
    }),
    [
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      wishlist,
      toggleWishlist,
      isWishlisted,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}