import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Cpu,
  Monitor,
  HardDrive,
  BatteryCharging,
  Fan,
  Box,
  X,
  MemoryStick,
  Keyboard,
} from "lucide-react";

import "../styles/SearchResults.css";
import { searchProducts, fetchCategories } from "../services/productService.js";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";

const RESULTS_PER_PAGE = 12;

const CATEGORY_ICONS = {
  "Processors (CPU)": Cpu,
  Motherboards: Box,
  "Graphics Cards (GPU)": Monitor,
  RAM: MemoryStick,
  Storage: HardDrive,
  "Power Supplies (PSU)": BatteryCharging,
  Cooling: Fan,
  "PC Cases": Box,
  Monitors: Monitor,
  Peripherals: Keyboard,
};

export default function SearchResults() {
  // Initialize from the URL (?q=..., ?category=...) so searches and
  // category links from the Home page open the matching results.
  const searchParams = new URLSearchParams(window.location.search);
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") || null;

  const [searchTerm] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);

  const [results, setResults] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: RESULTS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [brandFacets, setBrandFacets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    searchProducts({
      q: searchTerm,
      category: category || undefined,
      brand: selectedBrands.length > 0 ? selectedBrands : undefined,
      sort,
      page,
      limit: RESULTS_PER_PAGE,
    })
      .then((data) => {
        if (cancelled) return;
        setResults(data.results ?? []);
        setPagination(data.pagination ?? {});
        if (Array.isArray(data.brands)) setBrandFacets(data.brands);
        setError(null);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load search results.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchTerm, category, selectedBrands, sort, page, retryCount]);

  // Sidebar categories come from the backend so the list never goes stale.
  useEffect(() => {
    let cancelled = false;
    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        /* sidebar simply shows no categories — never blocks the results */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectCategory = (name) => {
    setError(null);
    setCategory(name);
    setPage(1);
  };

  const toggleBrand = (brand) => {
    setError(null);
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setError(null);
    setCategory(null);
    setSelectedBrands([]);
    setPage(1);
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    setError(null);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let productArea;
  if (error) {
    productArea = (
      <PageState
        variant="error"
        title={error}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  } else if (loading) {
    productArea = <PageState variant="loading" />;
  } else if (results.length === 0) {
    productArea = (
      <PageState
        variant="empty"
        title={`No products found for "${searchTerm}".`}
        message="Try a different keyword, or clear the filters."
      />
    );
  } else {
    productArea = (
      <>
        <ProductGrid products={results} />

        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button
              type="button"
              className="prev-page"
              aria-label="Previous page"
              onClick={() => changePage(page - 1)}
              disabled={page <= 1}
            >
              ←
            </button>
            {Array.from(
              { length: pagination.totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <button
                type="button"
                key={pageNumber}
                className={pageNumber === pagination.page ? "page active-page" : "page"}
                onClick={() => changePage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            <button
              type="button"
              className="next-page"
              aria-label="Next page"
              onClick={() => changePage(page + 1)}
              disabled={page >= pagination.totalPages}
            >
              →
            </button>
          </div>
        )}
      </>
    );
  }

  const hasFilters = category !== null || selectedBrands.length > 0;

  return (
    <div className="search-layout">
      <aside className="filters-sidebar">
        <button
          type="button"
          className="back-button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          ← &nbsp; Back to Home
        </button>

        <div className="sidebar-section">
          <h3>Categories</h3>
          <div className="category-list">
            <button
              type="button"
              className={category === null ? "category active" : "category"}
              onClick={() => selectCategory(null)}
            >
              <LayoutGrid size={18} />
              <span>All Categories</span>
              <small className="cat-count">{pagination.total || ""}</small>
            </button>

            {categories.map((item) => {
              const Icon = CATEGORY_ICONS[item.name] || Box;
              return (
                <button
                  type="button"
                  key={item.name}
                  className={
                    category === item.name ? "category active" : "category"
                  }
                  onClick={() => selectCategory(item.name)}
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
          <h3>Price Range</h3>
          <div className="price-slider">
            <div className="slider-line"></div>
            <div className="slider-dot left"></div>
            <div className="slider-dot right"></div>
          </div>
          <div className="price-labels">
            <span>₹0</span>
            <span>₹1,50,000</span>
          </div>
        </div>

        {brandFacets.length > 0 && (
          <div className="filter-section">
            <h3>Brand</h3>
            <div className="brand-list">
              {brandFacets.map(({ name, count }) => (
                <label className="brand-filter" key={name}>
                  <input
                    type="checkbox"
                    value={name}
                    checked={selectedBrands.includes(name)}
                    onChange={() => toggleBrand(name)}
                  />
                  <span className="custom-checkbox"></span>
                  <span>{name}</span>
                  <small>({count})</small>
                </label>
              ))}
            </div>
          </div>
        )}

        {hasFilters && (
          <button type="button" className="clear-button" onClick={clearFilters}>
            <X size={16} />
            <span>Clear Filters</span>
          </button>
        )}
      </aside>

      <main className="content">
        <div className="breadcrumb">
          <span>Home</span>
          <ChevronRight size={15} />
          <span>Search Results</span>
        </div>

        <div className="title-row">
          <div className="title-content">
            <h2>Search Results</h2>
            <p>
              Showing {loading ? "…" : pagination.total}{" "}
              {pagination.total === 1 ? "result" : "results"}
              {searchTerm ? (
                <>
                  {" "}
                  for <strong>"{searchTerm}"</strong>
                </>
              ) : (
                ""
              )}
              {category ? (
                <>
                  {" "}
                  in <strong>{category}</strong>
                </>
              ) : (
                ""
              )}
            </p>
          </div>

          <div className="sort-button sort-wrap">
            <span>Sort by:</span>
            <select
              value={sort}
              onChange={(event) => {
                setError(null);
                setSort(event.target.value);
                setPage(1);
              }}
              aria-label="Sort results"
            >
              <option value="relevance">Relevance</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
            <ChevronDown size={17} className="chevron" />
          </div>
        </div>

        {productArea}
      </main>
    </div>
  );
}