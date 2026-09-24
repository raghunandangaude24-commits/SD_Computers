import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories, searchProducts } from "../services/productService.js";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";
import { useStore } from "../store/StoreContext.jsx";
import { categoryIcon } from "../constants.js";

/**
 * Home page. All product + category content comes from the backend:
 * - "Shop by Category" tiles are fetched from GET /api/categories
 * - "Deals of the Day" uses GET /api/search (newest)
 * - "Popular Picks" uses GET /api/search?popular=1&sort=rating
 * No hardcoded product or category arrays remain.
 */

function Benefits() {
  return (
    <section className="benefits">
      <div>
        <i>♢</i>
        <span>
          <strong>100% Genuine Products</strong>
          <small>
            Trusted & genuine products
            <br />
            with warranty
          </small>
        </span>
      </div>
      <div>
        <i>▱</i>
        <span>
          <strong>Fast Delivery</strong>
          <small>
            Quick delivery at your
            <br />
            doorstep
          </small>
        </span>
      </div>
      <div>
        <i>♧</i>
        <span>
          <strong>Expert Support</strong>
          <small>
            Get help from our
            <br />
            PC experts
          </small>
        </span>
      </div>
      <div>
        <i>♙</i>
        <span>
          <strong>Best Prices</strong>
          <small>
            Competitive prices
            <br />
            everyday
          </small>
        </span>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { cartCount } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

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

  const subscribe = () => {
    setNewsletterMessage(
      newsletterEmail.includes("@")
        ? "Subscribed successfully"
        : "Enter a valid email address"
    );
  };

  return (
    <div className="home-layout">
      <aside className="sidebar">
        <div className="category-title">▦ &nbsp; All Categories</div>
        {categoryError && (
          <p className="sidebar-feedback">Unable to load categories.</p>
        )}
        {!categoryError &&
          categories.map((category) => (
            <Link key={category.id} to={`/category/${category.slug}`}>
              <span>◌</span>
              {category.name}
            </Link>
          ))}
        <div className="build-box">
          <strong>
            BUILD YOUR PC <em>→</em>
          </strong>
          <small>
            Not sure what fits best?
            <br />
            Browse our full catalog
          </small>
          <Link to="/search">Start Building&nbsp; →</Link>
          <div className="mini-case">▥</div>
        </div>
      </aside>

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

        <Benefits />

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

      <aside className="right-rail">
        <div className="rail-builder">
          <strong>PC BUILDER</strong>
          <small>
            Select components and
            <br />
            build your dream PC
          </small>
          <div>▥</div>
          <Link to="/search">Start Building&nbsp; →</Link>
        </div>
        <div className="newsletter">
          <strong>NEWSLETTER</strong>
          <small>
            Get updates on new arrivals
            <br />
            and exclusive offers
          </small>
          <input
            value={newsletterEmail}
            onChange={(event) => setNewsletterEmail(event.target.value)}
            placeholder="Enter your email"
            aria-label="Newsletter email"
          />
          <button onClick={subscribe} type="button">
            Subscribe
          </button>
          {newsletterMessage && (
            <small className="newsletter-message">{newsletterMessage}</small>
          )}
        </div>
        <div className="mini-cart-cta">
          <strong>CART</strong>
          <small>
            {cartCount > 0
              ? `${cartCount} item${cartCount === 1 ? "" : "s"} ready for checkout`
              : "Your cart is empty"}
          </small>
          <Link to="/cart">View Cart&nbsp; →</Link>
        </div>
      </aside>
    </div>
  );
}