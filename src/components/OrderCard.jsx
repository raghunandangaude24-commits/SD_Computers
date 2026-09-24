import { Link } from "react-router-dom";

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
 */
export default function OrderCard({ order }) {
  const date = formatDate(order.createdAt);

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
      </div>
    </div>
  );
}