import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { categoryService } from "../services/categoryService.js";
import { listProducts } from "../services/productService.js";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import FilterSidebar, { MobileFilters } from "../components/FilterSidebar.jsx";
import "../styles/SearchResults.css";

const RESULTS_PER_PAGE = 24;

/**
 * Category page. The category arrives as a URL slug (/category/:slug);
 * legacy ?name= links are also accepted for backward compatibility.
 * Products come from GET /api/products?category=... with live brand
 * facets, price and sort filters.
 */
export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nameParam = searchParams.get("name") || null;

  const [category, setCategory] = useState(null);
  const [categoryError, setCategoryError] = useState(false);
  // Full category list for the sidebar, so "All Categories" and every
  // other category are clickable on this page too (not just on Home).
  const [allCategories, setAllCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [brandFacets, setBrandFacets] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const categoryKey = slug || nameParam;

  // Resolve the category metadata from the slug (backend also falls back
  // to a plain name match, so legacy links keep working).
  useEffect(() => {
    let cancelled = false;
    // Intentionally resets filters when navigating to a different category.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategory(null);
    setCategoryError(false);
    setPage(1);
    setSelectedBrands([]);
    setPriceMin("");
    setPriceMax("");

    if (!categoryKey) {
      setCategoryError(true);
      return undefined;
    }

    categoryService
      .getBySlug(categoryKey)
      .then((data) => {
        if (!cancelled) setCategory(data);
      })
      .catch(() => {
        if (!cancelled) setCategoryError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryKey]);

  // Load the full category list once so the sidebar can offer every
  // category (matching the Home and Search pages).
  useEffect(() => {
    let cancelled = false;
    categoryService
      .list()
      .then((data) => {
        if (!cancelled) setAllCategories(data);
      })
      .catch(() => {
        /* sidebar falls back to showing just the current category */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch products once the category name is known.
  useEffect(() => {
    if (!category || !category.name) return undefined;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);

    listProducts({
      category: category.name,
      brand: selectedBrands.length > 0 ? selectedBrands : undefined,
      price_min: priceMin || undefined,
      price_max: priceMax || undefined,
      sort,
      page,
      limit: RESULTS_PER_PAGE,
    })
      .then((data) => {
        if (cancelled) return;
        setProducts(data.products ?? []);
        setPagination(data.pagination ?? {});
        setBrandFacets(data.brands ?? []);
        setError(false);
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
  }, [category, selectedBrands, priceMin, priceMax, sort, page, retryCount]);

  const retry = () => {
    setError(false);
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  const toggleBrand = (brand) => {
    setError(false);
    setSelectedBrands((current) =>
      current.includes(brand)
        ? current.filter((item) => item !== brand)
        : [...current, brand]
    );
    setPage(1);
  };

  const onPriceChange = ({ min, max }) => {
    setError(false);
    setPriceMin(min);
    setPriceMax(max);
    setPage(1);
  };

  const clearFilters = () => {
    setError(false);
    setSelectedBrands([]);
    setPriceMin("");
    setPriceMax("");
    setPage(1);
  };

  /** Sidebar category click: null → all categories (/search), otherwise
   *  navigate to the clicked category's clean slug URL. */
  const selectCategory = (name) => {
    if (!name) {
      navigate("/search");
      return;
    }
    const match = allCategories.find((item) => item.name === name);
    navigate(match ? `/category/${match.slug}` : `/category/${encodeURIComponent(name)}`);
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    setError(false);
    setLoading(true);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let productArea;
  if (categoryError) {
    productArea = (
      <PageState
        variant="empty"
        title="Category not found."
        message="It may have been renamed or removed."
      />
    );
  } else if (loading) {
    productArea = <PageState variant="loading" />;
  } else if (error) {
    productArea = (
      <PageState
        variant="error"
        title="Unable to load products."
        message="Make sure the backend is running."
        onRetry={retry}
      />
    );
  } else if (products.length === 0) {
    productArea = (
      <PageState
        variant="empty"
        title="No products found."
        message="Try clearing the filters, or check back later."
      />
    );
  } else {
    productArea = (
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

  const sidebar = (
    <FilterSidebar
      categories={allCategories.length > 0 ? allCategories : category ? [category] : []}
      activeCategory={category ? category.name : null}
      onSelectCategory={selectCategory}
      brands={brandFacets}
      selectedBrands={selectedBrands}
      onToggleBrand={toggleBrand}
      priceMin={priceMin}
      priceMax={priceMax}
      onPriceChange={onPriceChange}
      onClear={clearFilters}
      total={pagination.total}
    />
  );

  return (
    <div className="listing-page">
      <div className="listing-head">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: category?.name || "Category" },
          ]}
        />
        <MobileFilters>{sidebar}</MobileFilters>
      </div>

      <div className="search-layout">
        <div className="desktop-sidebar">{sidebar}</div>

        <main className="content">
          <div className="title-row">
            <div className="title-content">
              <h2>{category?.name || "Category"}</h2>
              <p>
                {category?.description && (
                  <span className="category-description">{category.description}</span>
                )}
                {"Showing "}
                {loading ? "…" : pagination.total}{" "}
                {pagination.total === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="sort-button sort-wrap">
              <span>Sort by:</span>
              <select
                value={sort}
                onChange={(event) => {
                  setError(false);
                  setSort(event.target.value);
                  setPage(1);
                }}
                aria-label="Sort products"
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

          {productArea}
        </main>
      </div>
    </div>
  );
}