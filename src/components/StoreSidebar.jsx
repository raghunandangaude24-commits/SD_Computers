import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../services/productService.js";

/**
 * Shared category loader: one request per app session so navigating
 * between pages doesn't refetch the list every time.
 */
let categoriesPromise = null;
function loadCategories() {
  if (!categoriesPromise) {
    const request = fetchCategories();
    categoriesPromise = request;
    request.catch(() => {
      if (categoriesPromise === request) categoriesPromise = null;
    });
  }
  return categoriesPromise;
}

/**
 * Left category rail — the Home page's sidebar, extracted so every
 * storefront route renders the same left column through the Layout shell.
 */
export default function StoreSidebar() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadCategories()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="category-title">▦ &nbsp; All Categories</div>
      {error && <p className="sidebar-feedback">Unable to load categories.</p>}
      {!error &&
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
  );
}
