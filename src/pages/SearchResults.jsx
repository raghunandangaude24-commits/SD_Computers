import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import "../styles/SearchResults.css";
import { searchProducts, fetchCategories } from "../services/productService.js";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FilterSidebar, { MobileFilters } from "../components/FilterSidebar.jsx";

const RESULTS_PER_PAGE = 12;

export default function SearchResults() {
  // Initialize from the URL (?q=..., ?category=...) so searches and
  // category links from the Home page open the matching results.
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const initialCategory = searchParams.get("category") || null;

  const [searchTerm] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
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
      price_min: priceMin || undefined,
      price_max: priceMax || undefined,
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
  }, [searchTerm, category, selectedBrands, priceMin, priceMax, sort, page, retryCount]);

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

  const onPriceChange = ({ min, max }) => {
    setError(null);
    setPriceMin(min);
    setPriceMax(max);
    setPage(1);
  };

  const clearFilters = () => {
    setError(null);
    setCategory(null);
    setSelectedBrands([]);
    setPriceMin("");
    setPriceMax("");
    setPage(1);
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    setError(null);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (category) params.set("category", category);
    setSearchParams(params, { replace: true });
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
        title={`No products found${searchTerm ? ` for "${searchTerm}"` : ""}.`}
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

  const sidebar = (
    <FilterSidebar
      categories={categories}
      activeCategory={category}
      onSelectCategory={selectCategory}
      brands={brandFacets}
      selectedBrands={selectedBrands}
      onToggleBrand={toggleBrand}
      priceMin={priceMin}
      priceMax={priceMax}
      onPriceChange={onPriceChange}
      onClear={clearFilters}
      total={pagination.total}
      showBack
    />
  );

  return (
    <div className="listing-page">
      <div className="listing-head">
        <Breadcrumbs
          items={[{ label: "Home", to: "/" }, { label: "Search Results" }]}
        />
        <MobileFilters>{sidebar}</MobileFilters>
      </div>

      <div className="search-layout">
        <div className="desktop-sidebar">{sidebar}</div>

        <main className="content">
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
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown size={17} className="chevron" />
            </div>
          </div>

          <button
            type="button"
            className="url-update-btn"
            onClick={updateUrl}
            title="Copy the current filters into the URL"
          >
            Copy filters to URL
          </button>

          {productArea}
        </main>
      </div>
    </div>
  );
}