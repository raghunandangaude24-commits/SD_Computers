import { useEffect, useState } from "react";
import { ShoppingCart, Box, Zap } from "lucide-react";
import { fetchProduct } from "../services/productService.js";
import PageState from "../components/PageState.jsx";
import { useStore } from "../store/StoreContext.jsx";

/**
 * Product Detail page.
 * The product id comes from the URL (/product/:id) and the page fetches the
 * full product from GET /api/products/:id — nothing is hardcoded per product.
 */
export default function ProductDetailPage({ productId }) {
  const { addToCart } = useStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageFailed, setImageFailed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

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

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedMessage(`Added ${quantity} to your cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    window.location.href = "/cart";
  };

  return (
    <div className="detail-page-wrap">
      <div className="breadcrumbs">
        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Home
        </button>
        <span>›</span>
        <button
          type="button"
          onClick={() =>
            window.location.assign(
              `/category?name=${encodeURIComponent(product.category)}`
            )
          }
        >
          {product.category}
        </button>
        <span>›</span>
        <span className="current">{product.name}</span>
      </div>

      <main className="detail-page">
        <div className="thumbs">
          <button className="active" type="button" aria-label="Product image">
            {!imageFailed ? (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImageFailed(true)}
              />
            ) : (
              <Box size={28} />
            )}
          </button>
        </div>

        <div className="main-image">
          {!imageFailed ? (
            <img
              src={product.image}
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

          <div className="detail-price">
            {product.price}
            {product.discount && <b>{product.discount}</b>}
            {product.oldPrice && <del>{product.oldPrice}</del>}
            <small>(Inclusive of all taxes)</small>
          </div>

          <div className="stock">
            <strong>◉ &nbsp; Ships within 24 hours</strong>
            <span>Fast &amp; reliable delivery</span>
          </div>

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

          <div className="assurances">
            <span>
              ♢ <small>1 Year Warranty</small>
            </span>
            <span>
              ◌ <small>7 Days Replacement</small>
            </span>
            <span>
              ▱ <small>Secure Payment</small>
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
              >
                -
              </button>
              {quantity}
              <button
                onClick={() => setQuantity((value) => value + 1)}
                type="button"
                aria-label="Increase quantity"
              >
                +
              </button>
            </span>
          </div>

          <button className="add" onClick={handleAddToCart} type="button">
            <ShoppingCart size={16} /> &nbsp; Add to Cart
          </button>
          <button className="buy" onClick={handleBuyNow} type="button">
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
            <strong>Secure Payment</strong>
            <div>
              <span>VISA</span>
              <span>MasterCard</span>
              <span>PayPal</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}