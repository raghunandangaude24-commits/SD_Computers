/**
 * Unified Loading / Error / Empty state used by every data-driven page,
 * so no page ever shows a blank screen and all states look the same.
 */
export default function PageState({ variant = "loading", title, message, onRetry }) {
  if (variant === "loading") {
    return (
      <div className="page-state loading" role="status">
        <span className="state-spinner" aria-hidden="true" />
        <p>{title || "Loading products..."}</p>
      </div>
    );
  }

  if (variant === "error") {
    return (
      <div className="page-state error" role="alert">
        <p>{title || "Unable to load products."}</p>
        {message && <small>{message}</small>}
        {onRetry && (
          <button type="button" className="btn btn-outline" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="page-state empty">
      <p>{title || "No products found."}</p>
      {message && <small>{message}</small>}
    </div>
  );
}