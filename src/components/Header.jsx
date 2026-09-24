import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Home,
  LogOut,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import logo from "../assets/sd-computers-logo.svg";
import { useStore } from "../store/StoreContext.jsx";
import { categoryService } from "../services/categoryService.js";
import { categoryIcon } from "../constants.js";

/**
 * The single site header used on every storefront page. Navigation is
 * real router links (React Router) plus a categories dropdown fetched
 * from the backend and an account menu for signed-in users.
 */
export default function Header() {
  const navigate = useNavigate();
  const { user, cartCount, wishlistCount, logout } = useStore();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null); // "categories" | "account" | null
  const menuRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    categoryService
      .list()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        /* header simply shows no dropdown when the backend is down */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Close the dropdowns when clicking anywhere else.
  useEffect(() => {
    const onDocumentClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", onDocumentClick);
    return () => document.removeEventListener("mousedown", onDocumentClick);
  }, []);

  const submitSearch = (event) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/search?q=${encodeURIComponent(term)}` : "/search");
    setMenuOpen(null);
  };

  const userName = user?.name?.trim() || null;
  const userInitial = userName ? userName.charAt(0).toUpperCase() : null;

  const handleLogout = async () => {
    setMenuOpen(null);
    await logout();
    navigate("/");
  };

  const go = (path) => () => {
    setMenuOpen(null);
    navigate(path);
  };

  return (
    <header className="site-header" ref={menuRef}>
      <Link className="brand" to="/" aria-label="SD Computers home">
        <img className="brand-logo" src={logo} alt="SD Computers logo" />
        <span className="brand-text">
          <strong>SD COMPUTERS</strong>
          <small>BUILD YOUR LEGEND</small>
        </span>
      </Link>

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
        <Link className="header-link home-link" to="/">
          <Home size={18} />
          <span>Home</span>
        </Link>

        <Link className="header-link" to="/search">
          <span className="shop-all">Shop All</span>
        </Link>

        <div className="header-menu">
          <button
            type="button"
            className={`header-link ${menuOpen === "categories" ? "active" : ""}`}
            onClick={() =>
              setMenuOpen((current) =>
                current === "categories" ? null : "categories"
              )
            }
            aria-expanded={menuOpen === "categories"}
          >
            <span>Categories</span>
            <ChevronDown size={15} />
          </button>

          {menuOpen === "categories" && (
            <div className="header-dropdown categories-dropdown">
              <Link className="dropdown-all" to="/search" onClick={go("/search")}>
                <span>All Products</span>
                <ChevronRight size={15} />
              </Link>
              {categories.map((item) => {
                const Icon = categoryIcon(item.name);
                return (
                  <Link
                    key={item.id}
                    to={`/category/${item.slug}`}
                    onClick={go(`/category/${item.slug}`)}
                  >
                    <Icon size={16} />
                    <span>{item.name}</span>
                    {item.count > 0 && <small>{item.count}</small>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <Link
          className="header-link"
          to="/wishlist"
          aria-label={`Wishlist, ${wishlistCount} items`}
        >
          <span className="icon-badge">
            <Heart size={19} />
            {wishlistCount > 0 && <b>{wishlistCount}</b>}
          </span>
          <span>Wishlist</span>
        </Link>

        <Link
          className="header-link"
          to="/cart"
          aria-label={`Cart, ${cartCount} items`}
        >
          <span className="icon-badge">
            <ShoppingCart size={19} />
            {cartCount > 0 && <b>{cartCount}</b>}
          </span>
          <span>Cart</span>
        </Link>

        {user ? (
          <div className="header-menu account-menu">
            <button
              type="button"
              className={`header-link ${menuOpen === "account" ? "active" : ""}`}
              onClick={() =>
                setMenuOpen((current) => (current === "account" ? null : "account"))
              }
              aria-expanded={menuOpen === "account"}
            >
              <span className="user-avatar">{userInitial}</span>
              <span className="account-label">{userName}</span>
              <ChevronDown size={15} />
            </button>

            {menuOpen === "account" && (
              <div className="header-dropdown account-dropdown">
                <Link to="/profile" onClick={go("/profile")}>
                  <User size={15} /> My Profile
                </Link>
                <Link to="/orders" onClick={go("/orders")}>
                  <ClipboardList size={15} /> My Orders
                </Link>
                <Link to="/wishlist" onClick={go("/wishlist")}>
                  <Heart size={15} /> Wishlist
                </Link>
                <button type="button" onClick={handleLogout}>
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link className="header-link account-cta" to="/login">
            <span className="user-avatar">
              <User size={15} />
            </span>
            <span>Login</span>
          </Link>
        )}
      </nav>
    </header>
  );
}