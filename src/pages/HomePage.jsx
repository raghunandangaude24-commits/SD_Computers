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

/**
 * Gap between two consecutive slides, measured from the moment one
 * slide starts moving to the moment the next one starts — kept inside
 * the requested 3–4 second range (4000ms − 550ms slide animation =
 * ~3.45s of steady, fully readable time on every slide).
 */
const SLIDE_INTERVAL_MS = 4000;

/**
 * Marketing copy for the hero carousel. Static on purpose — these are
 * campaign headlines, not catalog data. Every CTA still lands on a real
 * search/category route instead of a dead end.
 */
const HERO_SLIDES = [
  {
    id: "new-arrivals",
    tone: "",
    art: "▦",
    eyebrow: "NEW ARRIVALS",
    titleLine: "POWER YOUR",
    titleAccent: "PERFORMANCE",
    body: ["Top quality PC components for gamers,", "creators and professionals."],
    cta: "Shop Now",
    to: "/search",
  },
  {
    id: "gaming",
    tone: "tone-gpu",
    art: "▤",
    eyebrow: "GAMING ESSENTIALS",
    titleLine: "BUILT TO",
    titleAccent: "WIN",
    body: ["Graphics cards, monitors and peripherals", "tuned for competitive play."],
    cta: "Shop Gaming",
    to: "/search?q=gaming",
  },
  {
    id: "ddr5-nvme",
    tone: "tone-memory",
    art: "▥",
    eyebrow: "DDR5 & NVME",
    titleLine: "LOAD IN AN",
    titleAccent: "INSTANT",
    body: ["Faster memory and storage for quick boots,", "loads and multitasking."],
    cta: "Shop Storage",
    to: "/search?q=ssd",
  },
  {
    id: "workstation",
    tone: "tone-pro",
    art: "▦",
    eyebrow: "WORKSTATION READY",
    titleLine: "POWER FOR",
    titleAccent: "CREATORS",
    body: ["Multi-core CPUs and pro displays built for", "heavy creative workloads."],
    cta: "Shop Components",
    to: "/search?q=intel",
  },
];

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [popular, setPopular] = useState([]);
  const [categoryError, setCategoryError] = useState(false);
  const [dealsError, setDealsError] = useState(false);
  const [popularError, setPopularError] = useState(false);
  const [dealsLoading, setDealsLoading] = useState(true);
  const [popularLoading, setPopularLoading] = useState(true);

  // Hero carousel state.
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Users who asked their OS for reduced motion get a static hero.
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  // Auto-advance. Restarts on every slide change (so clicking a dot
  // gives the new slide a full interval) and stops while hovered,
  // focused, or when reduced motion is requested.
  useEffect(() => {
    if (paused || reducedMotion || HERO_SLIDES.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [slide, paused, reducedMotion]);

  const goToSlide = (index) => () => setSlide(index);

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
        <section
          className="hero-banner"
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured promotions"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div
            className="hero-track"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {HERO_SLIDES.map((item, index) => {
              const active = index === slide;
              return (
                <article
                  key={item.id}
                  className={`hero-slide ${item.tone}`.trim()}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${HERO_SLIDES.length}`}
                  aria-hidden={!active}
                >
                  <div className="hero-copy">
                    <small>{item.eyebrow}</small>
                    <h1>
                      {item.titleLine}
                      <br />
                      <b>{item.titleAccent}</b>
                    </h1>
                    <p>
                      {item.body[0]}
                      <br />
                      {item.body[1]}
                    </p>
                    <Link to={item.to} tabIndex={active ? undefined : -1}>
                      {item.cta}&nbsp; →
                    </Link>
                  </div>
                  <div className="hero-pc" aria-hidden="true">
                    {item.art}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="dots" role="group" aria-label="Choose a hero slide">
            {HERO_SLIDES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={index === slide ? "dot active" : "dot"}
                onClick={goToSlide(index)}
                aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
                aria-current={index === slide}
              />
            ))}
          </div>
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