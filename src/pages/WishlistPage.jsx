import { Heart } from "lucide-react";
import ProductGrid from "../components/ProductGrid.jsx";
import PageState from "../components/PageState.jsx";
import { useStore } from "../store/StoreContext.jsx";

/**
 * Wishlist page. Items are saved product snapshots obtained from the
 * backend API (see StoreContext). A unified empty state is shown when
 * the wishlist has no items.
 */
export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <div className="listing-page">
      <div className="title-row">
        <div className="title-content">
          <h2>
            <Heart size={26} className="inline-icon" /> Wishlist
          </h2>
          <p>
            {wishlist.length === 1
              ? "1 saved product"
              : `${wishlist.length} saved products`}
          </p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <PageState
          variant="empty"
          title="Your wishlist is empty."
          message="Tap the heart on any product to save it here."
        />
      ) : (
        <ProductGrid products={wishlist} />
      )}
    </div>
  );
}