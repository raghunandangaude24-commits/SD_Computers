import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "../store/StoreContext.jsx";
import PageState from "../components/PageState.jsx";

/**
 * Cart page. Items come from the store (server cart for signed-in users,
 * localStorage for guests) — no hardcoded products. Checkout only ever
 * charges what the order summary shows (COD).
 */

const checkoutFeatures = [
  { icon: "✔", title: "Secure Checkout", text: "Your data is safe with us" },
  { icon: "▣", title: "Fast Delivery", text: "Quick & reliable shipping" },
  { icon: "◒", title: "24/7 Support", text: "We're here to help" },
];

function parseINR(value) {
  return Number(String(value || "0").replace(/[₹,\s]/g, "")) || 0;
}

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useStore();
  const [selectedItems, setSelectedItems] = useState(
    () => new Set(cartItems.map((item) => item.id))
  );
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const items = cartItems;
  const selected = items.filter((item) => selectedItems.has(item.id));
  const subtotal = selected.reduce(
    (sum, item) => sum + parseINR(item.price) * item.qty,
    0
  );
  const total = subtotal;
  const allSelected = items.length > 0 && selectedItems.size === items.length;

  if (items.length === 0) {
    return (
      <div className="listing-page">
        <PageState
          variant="empty"
          title="Your cart is empty."
          message="Browse our catalog and add something great to your build."
        />
        <div className="profile-actions">
          <Link className="btn btn-primary" to="/search">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const toggleItem = (id) => {
    setSelectedItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setCheckoutMessage("");
  };

  const toggleAll = () => {
    setSelectedItems(allSelected ? new Set() : new Set(items.map((item) => item.id)));
    setCheckoutMessage("");
  };

  const proceedToCheckout = () => {
    if (!selected.length) {
      setCheckoutMessage("Select at least one item to continue");
      return;
    }
    // Carry the chosen items to the Checkout page.
    sessionStorage.setItem(
      "sd_checkout_ids",
      JSON.stringify(selected.map((item) => item.id))
    );
    navigate("/checkout");
  };

  return (
    <div className="cart-page-wrap">
      <div className="page-header">
        <div className="cart-icon">
          <ShoppingCart size={22} />
        </div>
        <div>
          <h1>Shopping Cart</h1>
          <p>
            {items.length} item{items.length === 1 ? "" : "s"} in your cart
          </p>
        </div>
      </div>

      <div className="cart-layout">
        <section className="items-panel">
          <div className="items-header">
            <button
              className={`check-all ${allSelected ? "checked" : ""}`}
              onClick={toggleAll}
              type="button"
              aria-label="Select all items"
            >
              {allSelected ? "✓" : ""}
            </button>
            <span>Product</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Total</span>
            <span>Remove</span>
          </div>

          {items.map((item) => (
            <div className="cart-item" key={item.id}>
              <button
                className={`select-box ${selectedItems.has(item.id) ? "checked" : ""}`}
                onClick={() => toggleItem(item.id)}
                type="button"
                aria-label={`Select ${item.name}`}
              >
                {selectedItems.has(item.id) ? "✓" : ""}
              </button>

              <div className="product-cell">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(event) => {
                    event.currentTarget.style.visibility = "hidden";
                  }}
                />
                <div className="product-meta">
                  <h3>{item.name}</h3>
                  <p>{item.category}</p>
                  <span className="stock">Ships within 24 hours</span>
                </div>
              </div>

              <div className="price-box">{item.price}</div>

              <div className="qty-box">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  type="button"
                  aria-label={`Decrease ${item.name} quantity`}
                >
                  −
                </button>
                <span>{item.qty}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  type="button"
                  aria-label={`Increase ${item.name} quantity`}
                >
                  +
                </button>
              </div>

              <div className="total-box">
                ₹{(parseINR(item.price) * item.qty).toLocaleString("en-IN")}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                type="button"
                className="remove-btn"
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <div className="coupon-box">
            <div className="feature-row">
              {checkoutFeatures.map((feature) => (
                <div className="feature-item" key={feature.title}>
                  <div className="feature-icon">{feature.icon}</div>
                  <div>
                    <strong>{feature.title}</strong>
                    <small>{feature.text}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="summary-panel">
          <div className="summary-head">
            <span className="bag-icon">
              <ShoppingCart size={18} />
            </span>
            <h2>Order Summary</h2>
          </div>

          <div className="summary-row">
            <span>Subtotal ({selected.length} items)</span>
            <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery Charges</span>
            <strong className="free">FREE</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>

          <button
            onClick={proceedToCheckout}
            type="button"
            className="checkout-btn"
            disabled={!items.length}
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
          {checkoutMessage && (
            <p className="cart-feedback checkout-feedback">{checkoutMessage}</p>
          )}

          <div className="payment-row">
            <span>Cash on Delivery accepted</span>
            <div className="payment-icons">
              {["COD", "UPI (soon)", "Cards (soon)"].map((method) => (
                <button
                  key={method}
                  type="button"
                  disabled={method.includes("soon")}
                  onClick={() =>
                    setCheckoutMessage("You will pay by cash on delivery")
                  }
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="back-home-row">
        <Link to="/search">Continue Shopping →</Link>
      </div>
    </div>
  );
}