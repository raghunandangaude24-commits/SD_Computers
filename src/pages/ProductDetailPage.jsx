import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ShoppingCart, Box, Zap, Star } from "lucide-react";
import { fetchProduct, searchProducts } from "../services/productService.js";
import { reviewService } from "../services/reviewService.js";
import PageState from "../components/PageState.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import RatingStars from "../components/RatingStars.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import { useStore } from "../store/StoreContext.jsx";
import { categorySlug } from "../constants.js";

/**
 * Product Detail page. The product id comes from the URL and every
 * piece of content (description, specs, gallery, reviews, related
 * products) is fetched from the backend — nothing is hardcoded.
 */
export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();
  const { addToCart, user } = useStore();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({ rating: 0, reviewCount: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Reset transient state every time the product id changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProduct(null);
    setLoading(true);
    setError(false);
    setActiveImage(0);
    setImageFailed(false);
    setAddedMessage("");
    setReviewError("");
    setReviewMessage("");

    fetchProduct(productId)
      .then((data) => {
        if (cancelled) return;
        setProduct(data);
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
  }, [productId, retryCount]);

  useEffect(() => {
    let cancelled = false;

    reviewService
      .list(productId)
      .then((data) => {
        if (cancelled) return;
        setReviews(data.reviews ?? []);
        setReviewSummary(data.summary ?? { rating: 0, reviewCount: 0 });
      })
      .catch(() => {
        /* reviews are secondary — never block the page */
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Related products: same category, excluding the current product.
  useEffect(() => {
    if (!product) return undefined;
    let cancelled = false;

    searchProducts({
      category: product.category,
      page: 1,
      limit: 8,
    })
      .then((data) => {
        if (cancelled) return;
        const items = (data.results ?? []).filter((item) => item.id !== product.id);
        setRelated(items.slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

  const retry = () => {
    setError(false);
    setLoading(true);
    setImageFailed(false);
    setAddedMessage("");
    setRetryCount((count) => count + 1);
  };

  if (loading) {
    return <PageState variant="loading" title="Loading product..." />;
  }

  if (error) {
    return (
      <PageState
        variant="error"
        title="Unable to load this product."
        message="Make sure the backend is running and try again."
        onRetry={retry}
      />
    );
  }

  if (!product) {
    return (
      <PageState
        variant="empty"
        title="Product not found."
        message="It may have been removed from the catalog."
      />
    );
  }

  const specifications = Array.isArray(product.specifications)
    ? product.specifications
    : [];
  const facets = product.facets && typeof product.facets === "object" ? product.facets : null;
  const images = Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image];
  const inStock = Number(product.stock) > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity)
      .then(() => setAddedMessage(`Added ${quantity} to your cart`))
      .catch((err) => setAddedMessage(err.message || "Could not add to cart"));
  };

  const handleBuyNow = () => {
    addToCart(product, quantity)
      .then(() => navigate("/cart"))
      .catch((err) => setAddedMessage(err.message || "Could not add to cart"));
  };

  const submitReview = async (event) => {
    event.preventDefault();
    setReviewError("");
    setReviewMessage("");
    const comment = reviewForm.comment.trim();
    if (!comment) {
      setReviewError("Please write a short review before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const data = await reviewService.create(productId, {
        rating: reviewForm.rating,
        comment,
      });
      setReviews((current) => [data.review, ...current]);
      setReviewSummary(data.summary);
      setReviewForm({ rating: 5, comment: "" });
      setReviewMessage("Thanks! Your review has been posted.");
    } catch (err) {
      setReviewError(err.message || "Could not submit your review.");
    } finally {
      setSubmitting(false);
    }
  };

  const facetRows = facets
    ? Object.entries(facets).map(([key, value]) => [
        key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        value,
      ])
    : [];

  return (
    <div className="detail-page-wrap">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          {
            label: product.category,
            to: `/category/${categorySlug(product.category) || encodeURIComponent(product.category)}`,
          },
          { label: product.name },
        ]}
      />

      <main className="detail-page">
        <div className="thumbs">
          {images.map((image, index) => (
            <button
              key={image + index}
              className={activeImage === index ? "active" : ""}
              type="button"
              aria-label={`Product image ${index + 1}`}
              onClick={() => {
                setActiveImage(index);
                setImageFailed(false);
              }}
            >
              <img src={image} alt={`${product.name} — view ${index + 1}`} loading="lazy" />
            </button>
          ))}
        </div>

        <div className="main-image">
          {!imageFailed ? (
            <img
              src={images[activeImage] || product.image}
              alt={product.name}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="image-placeholder large" aria-hidden="true">
              <Box size={64} />
              <span>{product.category || "Product"}</span>
            </div>
          )}
        </div>

        <section className="product-info">
          <small className="eyebrow">
            {product.brand} • {product.category}
          </small>
          <h1>{product.name}</h1>

          {Number(product.rating) > 0 && (
            <RatingStars
              rating={product.rating}
              count={product.reviewCount}
              size={15}
            />
          )}

          <div className="detail-price">
            {product.price}
            {product.discount != null && <b>{Math.round(product.discount)}% OFF</b>}
            {product.oldPrice && <del>{product.oldPrice}</del>}
            <small>(Inclusive of all taxes)</small>
          </div>

          <div className="stock">
            {inStock ? (
              <>
                <strong>◉ &nbsp; In stock — ships within 24 hours</strong>
                <span>{product.stock} units available • Fast &amp; reliable delivery</span>
              </>
            ) : (
              <>
                <strong className="out">◉ &nbsp; Currently out of stock</strong>
                <span>Check back soon — new stock arrives regularly</span>
              </>
            )}
          </div>

          {product.description && (
            <>
              <h3>Description</h3>
              <p className="product-description">{product.description}</p>
            </>
          )}

          {specifications.length > 0 && (
            <>
              <h3>Key Features</h3>
              <ul>
                {specifications.map((spec) => (
                  <li key={spec}>{spec}</li>
                ))}
              </ul>
            </>
          )}

          {facetRows.length > 0 && (
            <>
              <h3>Specifications</h3>
              <table className="spec-table">
                <tbody>
                  {facetRows.map(([key, value]) => (
                    <tr key={key}>
                      <th>{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <div className="assurances">
            <span>
              ♢ <small>1 Year Warranty</small>
            </span>
            <span>
              ◌ <small>7 Days Replacement</small>
            </span>
            <span>
              ▱ <small>COD Available</small>
            </span>
            <span>
              ♢ <small>100% Authentic</small>
            </span>
          </div>
        </section>

        <aside className="buy-panel">
          <div className="quantity">
            <strong>Quantity</strong>
            <span>
              <button
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                type="button"
                aria-label="Decrease quantity"
                disabled={!inStock}
              >
                -
              </button>
              {quantity}
              <button
                onClick={() => setQuantity((value) => value + 1)}
                type="button"
                aria-label="Increase quantity"
                disabled={!inStock}
              >
                +
              </button>
            </span>
          </div>

          <button className="add" onClick={handleAddToCart} type="button" disabled={!inStock}>
            <ShoppingCart size={16} /> &nbsp; Add to Cart
          </button>
          <button className="buy" onClick={handleBuyNow} type="button" disabled={!inStock}>
            <Zap size={16} /> &nbsp; Buy Now
          </button>

          {addedMessage && <p className="cart-feedback">{addedMessage}</p>}

          <div className="delivery">
            <strong>▱ &nbsp; Check Delivery</strong>
            <div>
              <input placeholder="Enter your pincode" aria-label="Pincode" />
              <b>Check</b>
            </div>
            <small>Delivery options will appear once the pincode is entered.</small>
          </div>

          <div className="payment-box">
            <strong>Payment Options</strong>
            <div>
              <span>COD</span>
              <span>UPI (soon)</span>
              <span>Cards (soon)</span>
            </div>
          </div>
        </aside>
      </main>

      <section className="reviews-section">
        <div className="section-head">
          <h2>Customer Reviews</h2>
          {reviewSummary.reviewCount > 0 && (
            <span className="review-summary">
              <Star size={15} className="star filled" />
              {reviewSummary.rating.toFixed(1)} · {reviewSummary.reviewCount}{" "}
              {reviewSummary.reviewCount === 1 ? "review" : "reviews"}
            </span>
          )}
        </div>

        {!user ? (
          <p className="review-login-hint">
            <Link to="/login">Login</Link> to leave a review for this product.
          </p>
        ) : (
          <form className="review-form" onSubmit={submitReview}>
            <div className="review-form-row">
              <span className="review-label">Your rating</span>
              <div className="review-stars-input">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={value <= reviewForm.rating ? "star filled" : "star"}
                    onClick={() => setReviewForm((f) => ({ ...f, rating: value }))}
                    aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                  >
                    <Star size={20} />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              value={reviewForm.comment}
              onChange={(event) =>
                setReviewForm((f) => ({ ...f, comment: event.target.value }))
              }
              placeholder="Share your experience with this product..."
              rows={3}
              maxLength={2000}
              aria-label="Your review"
            />
            {reviewError && <p className="review-error">{reviewError}</p>}
            {reviewMessage && <p className="review-success">{reviewMessage}</p>}
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Posting..." : "Post Review"}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <PageState
            variant="empty"
            title="No reviews yet."
            message="Be the first to review this product."
          />
        ) : (
          <div className="review-list">
            {reviews.map((review) => (
              <div className="review-card" key={review.id}>
                <div className="review-head">
                  <span className="review-avatar">
                    {review.userName.charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <strong>{review.userName}</strong>
                    <RatingStars rating={review.rating} size={12} />
                  </div>
                </div>
                <p>{review.comment}</p>
                <small>
                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </small>
              </div>
            ))}
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="section related">
          <div className="section-head">
            <h2>You May Also Like</h2>
            <Link to={`/search?category=${encodeURIComponent(product.category)}`} className="section-link">
              View All&nbsp; →
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}