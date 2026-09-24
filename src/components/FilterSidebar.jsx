import { useState } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, X, SlidersHorizontal } from "lucide-react";
import { categoryIcon } from "../constants.js";

/**
 * The filter sidebar shared by the Search and Category pages.
 *
 * Props (all optional):
 *  - categories: [{ name, slug, count }]
 *  - activeCategory: category NAME selected (null = All)
 *  - onSelectCategory(name|null)
 *  - brands: [{ name, count }]
 *  - selectedBrands: [name]
 *  - onToggleBrand(name)
 *  - priceMin / priceMax: current price filter values (strings)
 *  - onPriceChange({min, max})
 *  - onClear(): reset every filter
 *  - total: result count for the "All Categories" row
 *  - showBack: render the "Back to Home" link (Search page)
 */
export default function FilterSidebar({
  categories = [],
  activeCategory = null,
  onSelectCategory,
  brands = [],
  selectedBrands = [],
  onToggleBrand,
  priceMin = "",
  priceMax = "",
  onPriceChange,
  onClear,
  total = 0,
  showBack = false,
}) {
  const hasFilters =
    activeCategory !== null || selectedBrands.length > 0 || priceMin !== "" || priceMax !== "";

  const commitPrice = (field) => (event) => {
    const value = event.target.value.replace(/[^\d]/g, "");
    const next = field === "min" ? { min: value, max: priceMax } : { min: priceMin, max: value };
    if (onPriceChange) onPriceChange(next);
  };

  return (
    <aside className="filters-sidebar">
      {showBack && (
        <Link className="back-button" to="/">
          ← &nbsp; Back to Home
        </Link>
      )}

      <div className="sidebar-section">
        <h3>Categories</h3>
        <div className="category-list">
          <button
            type="button"
            className={activeCategory === null ? "category active" : "category"}
            onClick={() => onSelectCategory && onSelectCategory(null)}
          >
            <LayoutGrid size={18} />
            <span>All Categories</span>
            <small className="cat-count">{total || ""}</small>
          </button>

          {categories.map((item) => {
            const Icon = categoryIcon(item.name);
            return (
              <button
                type="button"
                key={item.name}
                className={activeCategory === item.name ? "category active" : "category"}
                onClick={() => onSelectCategory && onSelectCategory(item.name)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
                <small className="cat-count">{item.count}</small>
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-section">
        <h3>Price Range (₹)</h3>
        <div className="price-inputs">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Min"
            aria-label="Minimum price"
            value={priceMin || ""}
            onChange={commitPrice("min")}
          />
          <span>—</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Max"
            aria-label="Maximum price"
            value={priceMax || ""}
            onChange={commitPrice("max")}
          />
        </div>
        <div className="price-hint">Live price filter — results update as you type.</div>
      </div>

      {brands.length > 0 && (
        <div className="filter-section">
          <h3>Brand</h3>
          <div className="brand-list">
            {brands.map(({ name, count }) => (
              <label className="brand-filter" key={name}>
                <input
                  type="checkbox"
                  value={name}
                  checked={selectedBrands.includes(name)}
                  onChange={() => onToggleBrand && onToggleBrand(name)}
                />
                <span className="custom-checkbox"></span>
                <span>{name}</span>
                <small>({count})</small>
              </label>
            ))}
          </div>
        </div>
      )}

      {hasFilters && onClear && (
        <button type="button" className="clear-button" onClick={onClear}>
          <X size={16} />
          <span>Clear Filters</span>
        </button>
      )}
    </aside>
  );
}

/**
 * Mobile wrapper: a "Filters" trigger button that opens the sidebar in a
 * slide-in drawer. Rendered beside the desktop sidebar (the CSS hides each
 * at the right breakpoint).
 */
export function MobileFilters({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-filters">
      <button
        type="button"
        className="filter-toggle"
        onClick={() => setOpen(true)}
        aria-label="Open filters"
      >
        <SlidersHorizontal size={15} /> Filters
      </button>

      {open && (
        <div className="filter-drawer-backdrop" onClick={() => setOpen(false)}>
          <div
            className="filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="filter-drawer-head">
              <h3>Filters</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close filters"
              >
                <X size={18} />
              </button>
            </div>
            <div className="filter-drawer-body">{children}</div>
          </div>
        </div>
      )}
    </div>
  );
}