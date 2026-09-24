import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Package } from "lucide-react";
import { orderService } from "../services/orderService.js";
import OrderCard from "../components/OrderCard.jsx";
import PageState from "../components/PageState.jsx";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

/**
 * Orders page (protected). Lists the current user's orders, newest first.
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const location = useLocation();
  const justPlaced = Boolean(location.state?.placed);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(false);

    orderService
      .list()
      .then((data) => {
        if (cancelled) return;
        setOrders(Array.isArray(data) ? data : []);
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
  }, [retryCount]);

  let content;
  if (loading) {
    content = <PageState variant="loading" title="Loading your orders..." />;
  } else if (error) {
    content = (
      <PageState
        variant="error"
        title="Unable to load orders."
        message="Make sure the backend is running."
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  } else if (orders.length === 0) {
    content = (
      <div className="empty-with-cta">
        <PageState
          variant="empty"
          title="No orders yet."
          message="When you place an order it will appear here."
        />
        <Link to="/search" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="orders-list">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  }

  return (
    <div className="listing-page orders-page">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "My Account", to: "/profile" },
          { label: "Orders" },
        ]}
      />

      <div className="title-row">
        <div className="title-content">
          <h1>
            <Package size={26} className="inline-icon" /> My Orders
          </h1>
          <p>
            {orders.length} order{orders.length === 1 ? "" : "s"} placed
          </p>
        </div>
      </div>

      {justPlaced && (
        <div className="order-placed-banner">
          <strong>Order placed! 🎉</strong> We've received your order — you'll pay
          by cash on delivery when it arrives. Track it below.
        </div>
      )}

      {content}
    </div>
  );
}