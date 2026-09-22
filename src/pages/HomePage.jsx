import { useEffect, useState } from "react";
import {
  Box,
  Cpu,
  Monitor,
  HardDrive,
  BatteryCharging,
  Fan,
  MemoryStick,
  Keyboard,
} from "lucide-react";
import { fetchCategories, searchProducts } from "../services/productService.js";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";
import { useStore } from "../store/StoreContext.jsx";

/**
 * Home page. All product + category content comes from the backend:
 * - "Shop by Category" tiles are fetched from GET /api/search/categories
 * - "Deals of the Day" products are fetched from GET /api/search
 * No hardcoded product or category arrays remain.
 */

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

function categoryIcon(name) {
  return CATEGORY_ICONS[name] || Box;
}

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
  const [categoryError, setCategoryError] = useState(false);
  const [dealsError, setDealsError] = useState(false);
  const [dealsLoading, setDealsLoading] = useState(true);

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

  const openCategory = (name) => {
    window.location.assign(`/category?name=${encodeURIComponent(name)}`);
  };

  const openDeals = () => {
    window.location.assign("/search");
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
            <button
              key={category.name}
              onClick={() => openCategory(category.name)}
              type="button"
            >
              <span>◌</span>
              {category.name}
            </button>
          ))}
        <div className="build-box">
          <strong>
            BUILD YOUR PC <em>→</em>
          </strong>
          <small>
            Not sure what fits best?
            <br />
            Use our PC Builder
          </small>
          <button onClick={openDeals} type="button">
            Start Building&nbsp; →
          </button>
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
            <button onClick={openDeals} type="button">
              Shop Now&nbsp; →
            </button>
          </div>
          <div className="hero-pc">▦</div>
          <div className="dots">● ● ● ●</div>
        </section>

        <Benefits />

        <section className="section">
          <div className="section-head">
            <h2>SHOP BY CATEGORY</h2>
            <button
              type="button"
              className="section-link"
              onClick={() => window.location.assign("/search")}
            >
              View All&nbsp; →
            </button>
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
                  <button
                    key={category.name}
                    className="category-tile"
                    onClick={() => openCategory(category.name)}
                    type="button"
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
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="section deals">
          <div className="section-head">
            <h2>DEALS OF THE DAY</h2>
            <button type="button" className="section-link" onClick={openDeals}>
              View All Deals&nbsp; →
            </button>
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
          <button onClick={openDeals} type="button">
            Start Building&nbsp; →
          </button>
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
          <button
            onClick={() => {
              window.location.assign("/cart");
            }}
            type="button"
          >
            View Cart&nbsp; →
          </button>
        </div>
      </aside>
    </div>
  );
}