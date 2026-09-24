import { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Truck, Banknote, CreditCard, Smartphone } from "lucide-react";
import { useStore } from "../store/StoreContext.jsx";
import { orderService } from "../services/orderService.js";
import PageState from "../components/PageState.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal",
];

function parseINR(value) {
  return Number(String(value || "0").replace(/[₹,\s]/g, "")) || 0;
}

/**
 * Checkout page (protected). Cash on Delivery is the only live payment
 * method — online payment options are clearly marked as not yet available
 * and can never produce a fake "payment success".
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { user, cartItems } = useStore();

  // The Cart page stores the selected item ids; fall back to the full cart.
  const checkoutItems = useMemo(() => {
    let ids = [];
    try {
      ids = JSON.parse(sessionStorage.getItem("sd_checkout_ids") || "[]");
    } catch {
      ids = [];
    }
    if (Array.isArray(ids) && ids.length > 0) {
      return cartItems.filter((item) => ids.includes(item.id));
    }
    return cartItems;
  }, [cartItems]);

  const [shipping, setShipping] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const setField = (field) => (event) => {
    setShipping((current) => ({ ...current, [field]: event.target.value }));
    setError("");
  };

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + parseINR(item.price) * item.qty,
    0
  );

  const validate = () => {
    if (checkoutItems.length === 0) return "Your cart is empty.";
    if (shipping.name.trim().length < 2) return "Please enter your full name.";
    if (!/^\+?[0-9\s-]{10,15}$/.test(shipping.phone.trim())) {
      return "Please enter a valid phone number.";
    }
    if (shipping.address.trim().length < 5) return "Please enter your delivery address.";
    if (!shipping.city.trim()) return "Please enter your city.";
    if (!shipping.state) return "Please select your state.";
    if (!/^\d{6}$/.test(shipping.pincode.trim())) {
      return "PIN code must be 6 digits.";
    }
    return "";
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPlacing(true);
    try {
      const order = await orderService.create({
        items: checkoutItems.map((item) => ({
          productId: item.id,
          quantity: item.qty,
        })),
        shipping: {
          name: shipping.name.trim(),
          phone: shipping.phone.trim(),
          address: shipping.address.trim(),
          city: shipping.city.trim(),
          state: shipping.state,
          pincode: shipping.pincode.trim(),
        },
        paymentMethod,
      });
      sessionStorage.removeItem("sd_checkout_ids");
      navigate(`/orders/${order.id}`, { state: { placed: true } });
    } catch (err) {
      setError(err.message || "Could not place your order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (checkoutItems.length === 0) {
    return (
      <div className="listing-page">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Cart", to: "/cart" },
            { label: "Checkout" },
          ]}
        />
        <PageState
          variant="empty"
          title="Nothing to check out."
          message="Add some products to your cart and come back."
        />
        <div className="profile-actions">
          <Link className="btn btn-primary" to="/search">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Cart", to: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <form className="checkout-layout" onSubmit={placeOrder}>
        <div className="checkout-form">
          <section className="checkout-section">
            <h2>1 · Delivery Details</h2>
            <div className="shipping-grid">
              <label className="field">
                <span>Full Name</span>
                <input value={shipping.name} onChange={setField("name")} required />
              </label>
              <label className="field">
                <span>Phone</span>
                <input value={shipping.phone} onChange={setField("phone")} required inputMode="tel" />
              </label>
              <label className="field full">
                <span>Address</span>
                <textarea
                  value={shipping.address}
                  onChange={setField("address")}
                  rows={2}
                  required
                  placeholder="House no, street, area, landmark"
                />
              </label>
              <label className="field">
                <span>City</span>
                <input value={shipping.city} onChange={setField("city")} required />
              </label>
              <label className="field">
                <span>State</span>
                <select value={shipping.state} onChange={setField("state")} required>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>PIN Code</span>
                <input
                  value={shipping.pincode}
                  onChange={setField("pincode")}
                  required
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="6 digits"
                />
              </label>
            </div>
          </section>

          <section className="checkout-section">
            <h2>2 · Payment Method</h2>

            <label className={`payment-option ${paymentMethod === "cod" ? "selected" : ""}`}>
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              <span className="payment-icon">
                <Banknote size={20} />
              </span>
              <span className="payment-text">
                <strong>Cash on Delivery (COD)</strong>
                <small>Pay in cash when your order arrives at your door.</small>
              </span>
              <span className="payment-badge">Available</span>
            </label>

            <div className="payment-option disabled" aria-disabled="true">
              <input type="radio" disabled />
              <span className="payment-icon">
                <CreditCard size={20} />
              </span>
              <span className="payment-text">
                <strong>Credit / Debit Card</strong>
                <small>Online card payments are not enabled yet.</small>
              </span>
              <span className="payment-badge soon">Coming soon</span>
            </div>

            <div className="payment-option disabled" aria-disabled="true">
              <input type="radio" disabled />
              <span className="payment-icon">
                <Smartphone size={20} />
              </span>
              <span className="payment-text">
                <strong>UPI (GPay / PhonePe)</strong>
                <small>Online UPI payments are not enabled yet.</small>
              </span>
              <span className="payment-badge soon">Coming soon</span>
            </div>

            <p className="cod-note">
              <ShieldCheck size={15} /> Orders are confirmed instantly. Only Cash on
              Delivery is active; online payment options are placeholders.
            </p>
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {checkoutItems.map((item) => (
              <div className="summary-item" key={item.id}>
                <img src={item.image} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
                <div>
                  <span>{item.name}</span>
                  <small>
                    {item.price} × {item.qty}
                  </small>
                </div>
                <strong>₹{(parseINR(item.price) * item.qty).toLocaleString("en-IN")}</strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <strong className="free">FREE</strong>
          </div>
          <div className="summary-row total-row">
            <span>Total (payable on delivery)</span>
            <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="checkout-btn"
            disabled={placing}
          >
            {placing ? "Placing order..." : "Place Order (COD)"}
          </button>

          <div className="checkout-assurances">
            <span>
              <Truck size={15} /> Ships in 24 hours
            </span>
            <span>
              <ShieldCheck size={15} /> No advance payment needed
            </span>
          </div>

          <p className="checkout-terms">
            By placing this order you agree to our{" "}
            <Link to="/terms">Terms &amp; Conditions</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
        </aside>
      </form>
    </div>
  );
}