import { Link } from "react-router-dom";

/**
 * 404 page — shown for any unknown route.
 */
export default function NotFoundPage() {
  return (
    <div className="not-found">
      <div className="nf-code">404</div>
      <h1>Page not found</h1>
      <p>
        The page you are looking for doesn't exist, or the product may have
        been removed from the catalog.
      </p>
      <div className="profile-actions">
        <Link className="btn btn-primary" to="/">
          Back to Home
        </Link>
        <Link className="btn btn-outline" to="/search">
          Browse Products
        </Link>
      </div>
    </div>
  );
}