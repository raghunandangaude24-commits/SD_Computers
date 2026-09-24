import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Package, MapPin, Banknote } from "lucide-react";
import { orderService } from "../services/orderService.js";
import PageState from "../components/PageState.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

/**
 * Order detail page (protected). Users can only view their own orders —
 * the backend enforces ownership and returns 404 otherwise.
 */
export default function OrderDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const justPlaced = Boolean(location.state?.placed);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    // Reload from scratch when the order id (or a retry) changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError("");

    orderService
      .get(id)
      .then((data) => {
        if (cancelled) return;
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Unable to load this order.");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, retryCount]);

  if (loading) {
    return <PageState variant="loading" title="Loading order..." />;
  }

  if (error) {
    return (
      <PageState
        variant="error"
        title={error}
        message="It may have been removed or it may not belong to this account."
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  if (!order) {
    return <PageState variant="empty" title="Order not found." />;
  }

  return (
    <div className="listing-page order-detail-page">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "My Orders", to: "/orders" },
          { label: `Order #${order.id}` },
        ]}
      />

      {justPlaced && (
        <div className="order-placed-banner">
          <strong>Order placed! 🎉</strong> We've received your order — you'll pay
          by cash on delivery when it arrives.
        </div>
      )}

      <div className="order-detail-head">
        <div className="order-detail-id">
          <Package size={22} className="inline-icon" />
          <div>
            <h1>Order #{order.id}</h1>
            <p>Placed on {formatDate(order.createdAt)}</p>
          </div>
        </div>
        <div className="order-detail-badges">
          <span className={`order-status order-status-${order.orderStatus || "pending"}`}>
            {order.orderStatus || "Placed"}
          </span>
          <span className="order-status order-status-payment">
            {String(order.paymentMethod).toUpperCase()} • {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="order-detail-grid">
        <section className="order-items-table">
          <h2>Items ({order.itemCount})</h2>
          {order.items.map((item) => (
            <div className="order-line" key={item.id}>
              <img src={item.image} alt="" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
              <div className="order-line-info">
                <strong>{item.name}</strong>
                <small>
                  {item.price} × {item.quantity}
                </small>
              </div>
              <strong className="order-line-total">
                ₹{(parseINR(item.price) * item.quantity).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <div className="order-total-line">
            <span>Total (incl. free delivery)</span>
            <strong>{order.totalAmount}</strong>
          </div>
        </section>

        <aside className="order-shipping">
          <h2>
            <MapPin size={16} className="inline-icon" /> Delivery Address
          </h2>
          <strong>{order.shipping.name}</strong>
          <p>{order.shipping.phone}</p>
          <p>{order.shipping.address}</p>
          <p>
            {order.shipping.city}, {order.shipping.state} — {order.shipping.pincode}
          </p>

          <h2 className="payment-heading">
            <Banknote size={16} className="inline-icon" /> Payment
          </h2>
          <p>
            <strong>Cash on Delivery</strong> — pay {order.totalAmount} in cash when
            your order arrives.
          </p>
          <p className="payment-status">Status: {order.paymentStatus}</p>

          <Link to="/search" className="btn btn-outline">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}

function parseINR(value) {
  return Number(String(value || "0").replace(/[₹,\s]/g, "")) || 0;
}