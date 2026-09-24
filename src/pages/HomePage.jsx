import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, searchProducts } from "../services/productService.js";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";
import { categoryIcon } from "../constants.js";

/**
 * Home page. All product + category content comes from the backend:
 * - "Shop by Category" tiles are fetched from GET /api/categories
 * - "Deals of the Day" uses GET /api/search (newest)
 * - "Popular Picks" uses GET /api/search?popular=1&sort=rating
 * No hardcoded product or category arrays remain.
 * The left category rail comes from the shared Layout shell
 * (StoreSidebar) — same as every other page. The hero benefits strip
 * (Genuine Products / Fast Delivery / Expert Support / Best Prices)
 * was removed at the user's request.
 */

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [dealsError, setDealsError] = useState(false);
  const [popularError, setPopularError] = useState(false);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setCategoryError(true);
      });

    searchProducts({ limit: 8, sort: "newest" })
      .then((data) => {
        if (!cancelled) {
          setDeals(data.results ?? []);
          setDealsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDealsError(true);
          setDealsLoading(false);
        }
      });

    searchProducts({ limit: 8, sort: "rating", popular: true })
      .then((data) => {
        if (!cancelled) {
          setPopular(data.results ?? []);
          setPopularLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPopularError(true);
          setPopularLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="home-main">
        <section className="hero-banner">
          <div>
            <small>NEW ARRIVALS</small>
            <h1>
              POWER YOUR
              <br />
              <b>PERFORMANCE</b>
            </h1>
            <p>
              Top quality PC components for gamers,
              <br />
              creators and professionals.
            </p>
            <Link to="/search">Shop Now&nbsp; →</Link>
          </div>
          <div className="hero-pc">▦</div>
          <div className="dots">● ● ● ●</div>
        </section>

        <section className="section">
          <div className="section-head">
            <h2>SHOP BY CATEGORY</h2>
            <Link to="/search" className="section-link">
              View All&nbsp; →
            </Link>
          </div>

          {categoryError ? (
            <PageState
              variant="error"
              title="Unable to load categories."
              message="Make sure the backend is running."
            />
          ) : (
            <div className="category-grid">
              {categories.map((category) => {
                const Icon = categoryIcon(category.name);
                return (
                  <Link
                    key={category.id}
                    className="category-tile"
                    to={`/category/${category.slug}`}
                  >
                    <span className="category-icon">
                      <Icon size={22} />
                    </span>
                    <strong>{category.name}</strong>
                    <small>
                      {category.count > 0
                        ? `${category.count} product${category.count === 1 ? "" : "s"}`
                        : "Browse"}
                    </small>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="section deals">
          <div className="section-head">
            <h2>DEALS OF THE DAY</h2>
            <Link to="/search" className="section-link">
              View All Deals&nbsp; →
            </Link>
          </div>

          {dealsLoading ? (
            <PageState variant="loading" />
          ) : dealsError ? (
            <PageState
              variant="error"
              title="Unable to load products."
              message="Make sure the backend is running."
            />
          ) : deals.length === 0 ? (
            <PageState
              variant="empty"
              title="No products found."
              message="Check back soon for new deals."
            />
          ) : (
            <ProductGrid products={deals} />
          )}
        </section>

        <section className="section popular">
          <div className="section-head">
            <h2>POPULAR PICKS</h2>
            <Link to="/search" className="section-link">
              See More&nbsp; →
            </Link>
          </div>

          {popularLoading ? (
            <PageState variant="loading" />
          ) : popularError ? (
            <PageState
              variant="error"
              title="Unable to load products."
              message="Make sure the backend is running."
            />
          ) : popular.length === 0 ? (
            <PageState
              variant="empty"
              title="No products found."
              message="Check back soon for popular picks."
            />
          ) : (
            <ProductGrid products={popular} />
          )}
        </section>
    </main>
  );
}