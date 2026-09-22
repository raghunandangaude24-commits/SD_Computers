import { useState } from "react";
import { Heart, Search, ShoppingCart, User, ChevronDown, Home } from "lucide-react";
import logo from "../assets/sd-computers-logo.svg";
import { authService } from "../services/authService.js";

/**
 * The single site header used on every storefront page.
 * All navigation is plain URL links so a header works identically
 * across the Home, Search, Category, Product, Cart, Wishlist and
 * Profile pages.
 */
export default function Header({ cartCount = 0, wishlistCount = 0 }) {
  const user = authService.getUser();
  const userName = user?.name?.trim() || null;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : null;

  const currentQuery =
    new URLSearchParams(window.location.search).get("q") || "";

  const [query, setQuery] = useState(currentQuery);

  const submitSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    const qs = params.toString();
    window.location.href = qs ? `/search?${qs}` : "/search";
  };

  return (
    <header className="site-header">
      <button
        type="button"
        className="brand"
        onClick={() => {
          window.location.href = "/";
        }}
        aria-label="SD Computers home"
      >
        <img className="brand-logo" src={logo} alt="SD Computers logo" />
        <span className="brand-text">
          <strong>SD COMPUTERS</strong>
          <small>BUILD YOUR LEGEND</small>
        </span>
      </button>

      <form className="header-search" onSubmit={submitSearch} role="search">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for products, brands..."
          aria-label="Search products"
        />
        <button type="submit" aria-label="Search">
          <Search size={18} />
        </button>
      </form>

      <nav className="header-links" aria-label="Primary">
        <button
          type="button"
          className="header-link home-link"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          <Home size={18} />
          <span>Home</span>
        </button>

        <button
          type="button"
          className="header-link"
          onClick={() => {
            window.location.href = "/search";
          }}
        >
          <span className="shop-all">Shop All</span>
        </button>

        <button
          type="button"
          className="header-link"
          onClick={() => {
            window.location.href = "/wishlist";
          }}
          aria-label={`Wishlist, ${wishlistCount} items`}
        >
          <span className="icon-badge">
            <Heart size={19} />
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </span>
          <span>Wishlist</span>
        </button>

        <button
          type="button"
          className="header-link"
          onClick={() => {
            window.location.href = "/cart";
          }}
          aria-label={`Cart, ${cartCount} items`}
        >
          <span className="icon-badge">
            <ShoppingCart size={19} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </span>
          <span>Cart</span>
        </button>

        {userName ? (
          <button
            type="button"
            className="header-link user-link"
            onClick={() => {
              window.location.href = "/profile";
            }}
          >
            <span className="user-avatar">{userInitial}</span>
            <span>Hi, {userName.split(" ")[0]}</span>
            <ChevronDown size={14} />
          </button>
        ) : (
          <button
            type="button"
            className="header-link user-link"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            <span className="user-avatar">
              <User size={16} />
            </span>
            <span>Login</span>
          </button>
        )}
      </nav>
    </header>
  );
}