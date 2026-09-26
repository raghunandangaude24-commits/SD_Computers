import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authService } from "../services/authService.js";
import { cartService } from "../services/cartService.js";
import { wishlistService } from "../services/wishlistService.js";

/**
 * Global store for the whole storefront.
 *
 * - Auth: reactive `user` (initialised from the stored JWT session). On
 *   first load with a valid token the profile is re-validated and the
 *   server cart/wishlist are pulled down.
 * - Cart + wishlist: logged-in users use the server APIs; guests use
 *   localStorage. Logging in merges the guest items into the account
 *   (`POST /api/cart/sync` + wishlist adds), logging out returns to an
 *   empty guest cart.
 *
 * Cart items are normalised to the shape the cart page renders:
 *   { ...product, qty }
 */

const StoreContext = createContext(null);

const GUEST_CART_KEY = "sd_guest_cart";
const GUEST_WISHLIST_KEY = "sd_guest_wishlist";

function readGuest(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeGuest(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Convert a server cart item ({ quantity }) to the store ({ qty }). */
function toStoreItem(item) {
  return { ...item, qty: Number(item.quantity ?? item.qty ?? 1) };
}

const guestItems = () => ({
  user: null,
  cartItems: readGuest(GUEST_CART_KEY),
  wishlist: readGuest(GUEST_WISHLIST_KEY),
});

/**
 * Once-per-app bootstrap: validates the stored token (if any) and merges
 * the guest cart/wishlist into the account before switching to server state.
 */
let bootstrapPromise = null;
function bootstrapStore() {
  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      if (!authService.getToken()) return guestItems();

      // Read + clear guest lists synchronously so a concurrent re-run
      // (React StrictMode) never merges the same items twice.
      const guestCart = readGuest(GUEST_CART_KEY);
      const guestWishlist = readGuest(GUEST_WISHLIST_KEY);
      localStorage.removeItem(GUEST_CART_KEY);
      localStorage.removeItem(GUEST_WISHLIST_KEY);

      try {
        const data = await authService.me();
        if (guestCart.length > 0) {
          try {
            await cartService.syncCart(
              guestCart.map((item) => ({
                productId: item.id,
                quantity: item.qty || 1,
              }))
            );
          } catch {
            /* server may reject a stale item — keep going */
          }
        }
        if (guestWishlist.length > 0) {
          for (const item of guestWishlist) {
            try {
              await wishlistService.add(item.id);
            } catch {
              /* ignore duplicates / stale ids */
            }
          }
        }

        const [cart, list] = await Promise.all([
          cartService.getCart(),
          wishlistService.list(),
        ]);

        return {
          user: data.user,
          cartItems: cart.items.map(toStoreItem),
          wishlist: list.items,
        };
      } catch {
        // Token invalid/expired — drop the session and stay a guest.
        authService.clearSession();
        return { ...guestItems(), user: null };
      }
    })();
  }
  return bootstrapPromise;
}

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => authService.getUser());
  const [cartItems, setCartItems] = useState(() => readGuest(GUEST_CART_KEY));
  const [wishlist, setWishlist] = useState(() => readGuest(GUEST_WISHLIST_KEY));
  const [authReady, setAuthReady] = useState(false);

  // Refs mirror the current lists so async handlers can read fresh state.
  const cartRef = useRef(cartItems);
  const wishlistRef = useRef(wishlist);
  useEffect(() => {
    cartRef.current = cartItems;
  }, [cartItems]);
  useEffect(() => {
    wishlistRef.current = wishlist;
  }, [wishlist]);

  useEffect(() => {
    let cancelled = false;
    bootstrapStore()
      .then((state) => {
        if (cancelled) return;
        setUser(state.user);
        setCartItems(state.cartItems);
        setWishlist(state.wishlist);
      })
      .finally(() => {
        if (!cancelled) setAuthReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Push a freshly-created session into the store: merge whatever the
   * visitor built up as a guest into the account, then pull the server
   * cart/wishlist down. Shared by login and register — a brand new
   * account should keep the guest cart exactly like a returning one.
   *
   * The JWT itself is persisted by authService before this runs (the
   * "remember me" choice lives with login).
   */
  const hydrateSession = useCallback(async (data) => {
    const guestCart = readGuest(GUEST_CART_KEY);
    if (guestCart.length > 0) {
      try {
        await cartService.syncCart(
          guestCart.map((item) => ({
            productId: item.id,
            quantity: item.qty || 1,
          }))
        );
      } catch {
        /* keep the server cart as-is on a partial failure */
      }
    }

    const guestWishlist = readGuest(GUEST_WISHLIST_KEY);
    if (guestWishlist.length > 0) {
      for (const item of guestWishlist) {
        try {
          await wishlistService.add(item.id);
        } catch {
          /* ignore */
        }
      }
    }

    localStorage.removeItem(GUEST_CART_KEY);
    localStorage.removeItem(GUEST_WISHLIST_KEY);

    const [cart, list] = await Promise.all([
      cartService.getCart(),
      wishlistService.list(),
    ]);

    setUser(data.user);
    setCartItems(cart.items.map(toStoreItem));
    setWishlist(list.items);
    return data;
  }, []);

  /** POST /api/auth/login + merge guest cart/wishlist into the account. */
  const login = useCallback(
    async (email, password, remember = true) => {
      const data = await authService.login(email, password, remember);
      return hydrateSession(data);
    },
    [hydrateSession]
  );

  /** POST /api/auth/register — creates the account, signs it in and
   *  hydrates the store, so the page can go straight to the homepage. */
  const register = useCallback(
    async (payload) => {
      const data = await authService.register(payload);
      return hydrateSession(data);
    },
    [hydrateSession]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      /* server logout is best-effort */
    }
    authService.clearSession();
    setUser(null);
    setCartItems([]);
    setWishlist([]);
  }, []);

  /** Fresh profile from the server (after a profile edit). */
  const refreshProfile = useCallback(async () => {
    const data = await authService.me();
    setUser(data.user);
    return data.user;
  }, []);

  const refreshCart = useCallback(async () => {
    if (!user) return;
    const cart = await cartService.getCart();
    setCartItems(cart.items.map(toStoreItem));
  }, [user]);

  const refreshWishlist = useCallback(async () => {
    if (!user) return;
    const list = await wishlistService.list();
    setWishlist(list.items);
  }, [user]);

  const addToCart = useCallback(
    async (product, qty = 1) => {
      const quantity = Math.max(1, Number(qty) || 1);

      if (!user) {
        setCartItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          const next = existing
            ? current.map((item) =>
                item.id === product.id
                  ? { ...item, qty: item.qty + quantity }
                  : item
              )
            : [...current, { ...product, qty: quantity }];
          writeGuest(GUEST_CART_KEY, next);
          return next;
        });
        return;
      }

      // Optimistic local update, then adopt the authoritative server cart.
      setCartItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        return existing
          ? current.map((item) =>
              item.id === product.id
                ? { ...item, qty: item.qty + quantity }
                : item
            )
          : [...current, { ...product, qty: quantity }];
      });

      try {
        const cart = await cartService.addItem(product.id, quantity);
        setCartItems(cart.items.map(toStoreItem));
      } catch (err) {
        try {
          const cart = await cartService.getCart();
          setCartItems(cart.items.map(toStoreItem));
        } catch {
          /* unreachable */
        }
        throw err;
      }
    },
    [user]
  );

  const removeFromCart = useCallback(
    async (id) => {
      if (!user) {
        setCartItems((current) => {
          const next = current.filter((item) => item.id !== id);
          writeGuest(GUEST_CART_KEY, next);
          return next;
        });
        return;
      }

      setCartItems((current) => current.filter((item) => item.id !== id));
      try {
        const cart = await cartService.removeItem(id);
        setCartItems(cart.items.map(toStoreItem));
      } catch (err) {
        try {
          const cart = await cartService.getCart();
          setCartItems(cart.items.map(toStoreItem));
        } catch {
          /* unreachable */
        }
        throw err;
      }
    },
    [user]
  );

  /** change is a delta (-1 / +1) — same signature as the legacy store. */
  const updateQuantity = useCallback(
    async (id, change) => {
      if (!user) {
        setCartItems((current) => {
          const next = current.map((item) =>
            item.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
          );
          writeGuest(GUEST_CART_KEY, next);
          return next;
        });
        return;
      }

      const currentItem = cartRef.current.find((item) => item.id === id);
      if (!currentItem) return;
      const nextQty = Math.max(1, currentItem.qty + change);

      setCartItems((current) =>
        current.map((item) =>
          item.id === id ? { ...item, qty: nextQty } : item
        )
      );

      try {
        const cart = await cartService.updateItem(id, nextQty);
        setCartItems(cart.items.map(toStoreItem));
      } catch (err) {
        try {
          const cart = await cartService.getCart();
          setCartItems(cart.items.map(toStoreItem));
        } catch {
          /* unreachable */
        }
        throw err;
      }
    },
    [user]
  );

  const clearCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      writeGuest(GUEST_CART_KEY, []);
      return;
    }

    setCartItems([]);
    try {
      const cart = await cartService.clearCart();
      setCartItems(cart.items.map(toStoreItem));
    } catch (err) {
      try {
        const cart = await cartService.getCart();
        setCartItems(cart.items.map(toStoreItem));
      } catch {
        /* unreachable */
      }
      throw err;
    }
  }, [user]);

  const toggleWishlist = useCallback(
    async (product) => {
      const exists = wishlistRef.current.some((item) => item.id === product.id);

      if (!user) {
        setWishlist((current) => {
          const next = current.some((item) => item.id === product.id)
            ? current.filter((item) => item.id !== product.id)
            : [...current, product];
          writeGuest(GUEST_WISHLIST_KEY, next);
          return next;
        });
        return;
      }

      setWishlist((current) =>
        exists
          ? current.filter((item) => item.id !== product.id)
          : [...current, product]
      );

      try {
        const list = exists
          ? await wishlistService.remove(product.id)
          : await wishlistService.add(product.id);
        setWishlist(list.items);
      } catch (err) {
        try {
          const list = await wishlistService.list();
          setWishlist(list.items);
        } catch {
          /* unreachable */
        }
        throw err;
      }
    },
    [user]
  );

  const isWishlisted = useCallback(
    (id) => wishlist.some((item) => item.id === id),
    [wishlist]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authReady,
      cartItems,
      cartCount: cartItems.reduce((sum, item) => sum + item.qty, 0),
      wishlist,
      wishlistCount: wishlist.length,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      login,
      register,
      logout,
      refreshProfile,
      refreshCart,
      refreshWishlist,
    }),
    [
      user,
      authReady,
      cartItems,
      wishlist,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      toggleWishlist,
      isWishlisted,
      login,
      register,
      logout,
      refreshProfile,
      refreshCart,
      refreshWishlist,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

// The store context hook is intentionally co-located with its provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside a <StoreProvider>");
  }
  return context;
}