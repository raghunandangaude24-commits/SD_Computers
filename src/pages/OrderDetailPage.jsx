import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Package, MapPin, Banknote, XCircle } from "lucide-react";
import { orderService, isCancellable } from "../services/orderService.js";
import PageState from "../components/PageState.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";
import Modal from "../components/Modal.jsx";

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
 * Wording + tone for the Payment panel, derived from fulfilment state.
 *
 * Cash on Delivery only ever has two honest outcomes — cash still to be
 * collected, or no cash at all — so the panel must never print payment_status
 * raw: a cancelled order would otherwise keep telling the shopper to "pay when
 * your order arrives". The tone drives the colour (amber = waiting,
 * green = collected, red = closed without payment).
 */
function paymentSummary(order) {
  if (order.orderStatus === "cancelled") {
    return {
      tone: "cancelled",
      label: "cancelled",
      detail: "This order was cancelled — nothing is due.",
    };
  }

  if (order.paymentStatus === "paid") {
    return {
      tone: "paid",
      label: "paid",
      detail: `Paid in full — ${order.totalAmount} collected in cash.`,
    };
  }

  return {
    tone: "pending",
    label: order.paymentStatus,
    detail: (
      <>
        <strong>Cash on Delivery</strong> — pay {order.totalAmount} in cash when
        your order arrives.
      </>
    ),
  };
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

  // Order cancellation — confirmation dialog + in-flight state.
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");

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

  /**
   * Confirmed cancellation: swap in the order the backend returns so the
   * status badge flips to "cancelled" without a refetch. A 409 (e.g. it
   * shipped while the dialog was open) is shown inline instead.
   */
  const confirmCancel = async () => {
    if (cancelling) return;
    setCancelling(true);
    setCancelError("");

    try {
      const updated = await orderService.cancel(order.id);
      setOrder(updated);
      setConfirmOpen(false);
    } catch (err) {
      setCancelError(err.message || "Could not cancel this order.");
    } finally {
      setCancelling(false);
    }
  };

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

  const payment = paymentSummary(order);

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
          <span
            className={`order-status ${
              order.paymentStatus === "cancelled"
                ? "order-status-cancelled"
                : "order-status-payment"
            }`}
          >
            {String(order.paymentMethod).toUpperCase()} • {order.paymentStatus}
          </span>

          {isCancellable(order) && (
            <button
              type="button"
              className="btn btn-danger-outline"
              onClick={() => {
                setCancelError("");
                setConfirmOpen(true);
              }}
            >
              <XCircle size={15} /> Cancel Order
            </button>
          )}
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
          <p>{payment.detail}</p>
          <p className={`payment-status payment-status--${payment.tone}`}>
            Status: {payment.label}
          </p>

          <Link to="/search" className="btn btn-outline">
            Continue Shopping
          </Link>
        </aside>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => !cancelling && setConfirmOpen(false)}
        title={`Cancel order #${order.id}?`}
        footer={
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setConfirmOpen(false)}
              disabled={cancelling}
            >
              Keep Order
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel Order"}
            </button>
          </div>
        }
      >
        <p>
          This cancels <strong>Order #{order.id}</strong> — {order.itemCount}{" "}
          item{order.itemCount === 1 ? "" : "s"} worth {order.totalAmount}. The
          items go back into stock and nothing is charged, since you pay cash
          on delivery.
        </p>
        <p className="modal-note">This can't be undone.</p>

        {cancelError && <div className="order-cancel-error">{cancelError}</div>}
      </Modal>
    </div>
  );
}

function parseINR(value) {
  return Number(String(value || "0").replace(/[₹,\s]/g, "")) || 0;
}