import { Star } from "lucide-react";

/**
 * Compact star rating (product cards + review summaries).
 * `rating` is 0–5; `count` (optional) shows the review count.
 */
export default function RatingStars({ rating = 0, count, size = 13 }) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <span
      className="rating-stars"
      title={value > 0 ? `${value.toFixed(1)} out of 5 stars` : "No ratings yet"}
      aria-label={
        value > 0 ? `Rated ${value.toFixed(1)} out of 5 stars` : "No ratings yet"
      }
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(value) ? "star filled" : "star"}
          aria-hidden="true"
        />
      ))}
      {count != null && Number(count) > 0 && <small>({count})</small>}
    </span>
  );
}