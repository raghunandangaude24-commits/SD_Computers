import { useState } from "react";
import { Heart, ShoppingCart, Box } from "lucide-react";
import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext.jsx";
import RatingStars from "./RatingStars.jsx";

/**
 * The single product card used across the whole store.
 * Consumes the backend product shape:
 * { id, slug, name, brand, category, image, price, oldPrice, discount,
 *   specifications, stock, rating, reviewCount, description, facets }
 *
 * The card is fully data-driven (nothing hardcoded) and navigates with
 * real router links.
 */
export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [imageFailed, setImageFailed] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const specifications = Array.isArray(product.specifications)
    ? product.specifications
    : [];
  const discountLabel =
    product.discount != null && product.discount !== ""
      ? `${Math.round(Number(product.discount))}% OFF`
      : null;
  const inStock = Number(product.stock) > 0;

  const add = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
  };

  const favorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article className="product-card">
      <button
        type="button"
        className={`favorite ${wishlisted ? "active" : ""}`}
        onClick={favorite}
        aria-label={
          wishlisted
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
      >
        <Heart size={19} />
      </button>

      {discountLabel && <span className="discount-badge">{discountLabel}</span>}

      <Link
        className="product-image"
        to={`/product/${product.id}`}
        aria-label={`View ${product.name}`}
      >
        {!imageFailed ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageFailed(true)}
            loading="lazy"
          />
        ) : (
          <div className="image-placeholder" aria-hidden="true">
            <Box size={34} />
            <span>{product.category || "Product"}</span>
          </div>
        )}
      </Link>

      <div className="product-body">
        <small className="product-category">{product.category}</small>
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        {Number(product.rating) > 0 && (
          <RatingStars
            rating={product.rating}
            count={product.reviewCount}
            size={12}
          />
        )}

        {specifications.length > 0 && (
          <div className="product-specs">
            {specifications.slice(0, 3).map((spec, index) => (
              <span key={index}>
                {index > 0 && <i>|</i>}
                {spec}
              </span>
            ))}
          </div>
        )}

        <div className="product-price-row">
          <strong>{product.price}</strong>
          {product.oldPrice && <del>{product.oldPrice}</del>}
        </div>

        {inStock ? (
          <button type="button" className="add-cart" onClick={add}>
            <ShoppingCart size={17} />
            <span>Add to Cart</span>
          </button>
        ) : (
          <span className="stock-label out">Out of stock</span>
        )}
      </div>
    </article>
  );
}