import { useState } from "react";
import { Heart, ShoppingCart, Box } from "lucide-react";
import { useStore } from "../store/StoreContext.jsx";

/**
 * The single product card used across the whole store.
 * Consumes the backend product shape:
 * { id, name, brand, category, image, price, oldPrice, discount, specifications }
 *
 * Product images come from the backend `image` field. If the path cannot
 * load (e.g. the product image file does not exist yet), a clean icon
 * placeholder is shown instead — nothing is hardcoded.
 */
export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [imageFailed, setImageFailed] = useState(false);

  if (!product) return null;

  const wishlisted = isWishlisted(product.id);
  const specifications = Array.isArray(product.specifications)
    ? product.specifications
    : [];

  const openProduct = () => {
    window.location.href = `/product/${product.id}`;
  };

  const add = (event) => {
    event.stopPropagation();
    addToCart(product);
  };

  const favorite = (event) => {
    event.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <article className="product-card" onClick={openProduct}>
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

      {product.discount && <span className="discount-badge">{product.discount}</span>}

      <div className="product-image">
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
      </div>

      <div className="product-body">
        <small className="product-category">{product.category}</small>
        <h3>{product.name}</h3>

        {specifications.length > 0 && (
          <div className="product-specs">
            {specifications.map((spec, index) => (
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

        <button type="button" className="add-cart" onClick={add}>
          <ShoppingCart size={17} />
          <span>Add to Cart</span>
        </button>
      </div>
    </article>
  );
}