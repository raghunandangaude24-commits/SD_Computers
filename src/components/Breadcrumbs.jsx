import { Link } from "react-router-dom";

/**
 * Simple breadcrumb trail.
 * items: [{ label, to? }] — the last item is rendered as the current page.
 */
export default function Breadcrumbs({ items = [] }) {
  return (
    <nav className="crumb" aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={`${item.label}-${index}`} className="crumb-item">
            {index > 0 && <span className="crumb-sep">›</span>}
            {item.to && !isLast ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span className={isLast ? "crumb-current" : ""}>{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}