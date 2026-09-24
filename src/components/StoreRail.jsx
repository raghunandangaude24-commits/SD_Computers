import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/StoreContext.jsx";

/**
 * Right widget rail — PC builder, newsletter and cart CTA. Extracted
 * from the Home page so every storefront route shows the same rail.
 */
export default function StoreRail() {
  const { cartCount } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");

  const subscribe = () => {
    setNewsletterMessage(
      newsletterEmail.includes("@")
        ? "Subscribed successfully"
        : "Enter a valid email address"
    );
  };

  return (
    <aside className="right-rail">
      <div className="rail-builder">
        <strong>PC BUILDER</strong>
        <small>
          Select components and
          <br />
          build your dream PC
        </small>
        <div>▥</div>
        <Link to="/search">Start Building&nbsp; →</Link>
      </div>
      <div className="newsletter">
        <strong>NEWSLETTER</strong>
        <small>
          Get updates on new arrivals
          <br />
          and exclusive offers
        </small>
        <input
          value={newsletterEmail}
          onChange={(event) => setNewsletterEmail(event.target.value)}
          placeholder="Enter your email"
          aria-label="Newsletter email"
        />
        <button onClick={subscribe} type="button">
          Subscribe
        </button>
        {newsletterMessage && (
          <small className="newsletter-message">{newsletterMessage}</small>
        )}
      </div>
      <div className="mini-cart-cta">
        <strong>CART</strong>
        <small>
          {cartCount > 0
            ? `${cartCount} item${cartCount === 1 ? "" : "s"} ready for checkout`
            : "Your cart is empty"}
        </small>
        <Link to="/cart">View Cart&nbsp; →</Link>
      </div>
    </aside>
  );
}
