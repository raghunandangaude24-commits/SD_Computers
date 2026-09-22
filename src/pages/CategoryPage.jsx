import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { searchProducts } from "../services/productService.js";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";

/**
 * Category page.
 * Reads ?name= from the URL and fetches that category's products from
 * GET /api/search?category=... The list of categories itself comes from
 * the backend (used by the Home page tiles/sidebar).
 */
export default function CategoryPage() {
  const category =
    new URLSearchParams(window.location.search).get("name") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    searchProducts({ category: category || undefined, limit: 24, page })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.results ?? []);
        setPagination(data.pagination ?? {});
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, page, retryCount]);

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    setError(false);
    setLoading(true);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const retry = () => {
    setError(false);
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  let content;
  if (loading) {
    content = <PageState variant="loading" />;
  } else if (error) {
    content = (
      <PageState
        variant="error"
        title="Unable to load products."
        message="Make sure the backend is running."
        onRetry={retry}
      />
    );
  } else if (products.length === 0) {
    content = (
      <PageState
        variant="empty"
        title="No products found."
        message="No products are available in this category yet."
      />
    );
  } else {
    content = (
      <>
        <ProductGrid products={products} />
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

  return (
    <div className="listing-page">
      <div className="breadcrumb">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Home
        </button>
        <ChevronRight size={15} />
        <span>{category || "All Categories"}</span>
      </div>

      <div className="title-row">
        <div className="title-content">
          <h2>{category || "All Categories"}</h2>
          <p>
            Showing {loading ? "…" : pagination.total}{" "}
            {pagination.total === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      {content}
    </div>
  );
}