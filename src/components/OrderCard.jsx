import { useState } from "react";
import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import Modal from "./Modal.jsx";
import { orderService, isCancellable } from "../services/orderService.js";

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Compact summary card for one order (Orders page + profile).
 *
 * `onCancel` is optional. When supplied, orders that are still cancellable
 * get a Cancel button backed by a confirmation dialog; the updated order
 * the API returns is handed back to the parent so its list can be patched
 * in place instead of refetched.
 */
export default function OrderCard({ order, onCancel }) {
  const date = formatDate(order.createdAt);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const cancellable = Boolean(onCancel) && isCancellable(order);

  const confirmCancel = async () => {
    if (busy) return;
    setBusy(true);
    setError("");

    try {
      const updated = await orderService.cancel(order.id);
      setConfirmOpen(false);
      onCancel(updated);
    } catch (err) {
      // Shipped between render and confirm, or the network dropped —
      // keep the dialog open and show why.
      setError(err.message || "Could not cancel this order.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="order-card">
      <div className="order-card-head">
        <div className="order-card-id">
          <strong>Order #{order.id}</strong>
          <span>{date}</span>
        </div>
        <span className={`order-status order-status-${order.orderStatus || "pending"}`}>
          {order.orderStatus || "Placed"}
        </span>
      </div>

      <div className="order-card-items">
        {order.items.slice(0, 3).map((item) => (
          <div className="order-item-mini" key={item.id}>
            <img src={item.image} alt="" loading="lazy" />
            <div>
              <span>{item.name}</span>
              <small>
                {item.price} × {item.quantity}
              </small>
            </div>
          </div>
        ))}
        {order.items.length > 3 && (
          <small className="order-more">
            +{order.items.length - 3} more item
            {order.items.length - 3 === 1 ? "" : "s"}
          </small>
        )}
      </div>

      <div className="order-card-foot">
        <span className="order-pay">
          {String(order.paymentMethod).toUpperCase()} • {order.paymentStatus}
        </span>
        <strong className="order-total">{order.totalAmount}</strong>
        <Link className="btn btn-outline" to={`/orders/${order.id}`}>
          View Details
        </Link>
        {cancellable && (
          <button
            type="button"
            className="btn btn-danger-outline"
            onClick={() => {
              setError("");
              setConfirmOpen(true);
            }}
          >
            <XCircle size={15} /> Cancel
          </button>
        )}
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => !busy && setConfirmOpen(false)}
        title={`Cancel order #${order.id}?`}
        footer={
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setConfirmOpen(false)}
              disabled={busy}
            >
              Keep Order
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={confirmCancel}
              disabled={busy}
            >
              {busy ? "Cancelling..." : "Yes, Cancel Order"}
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

        {error && <div className="order-cancel-error">{error}</div>}
      </Modal>
    </div>
  );
}
