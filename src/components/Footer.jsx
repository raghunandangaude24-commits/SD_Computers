import { Link } from "react-router-dom";
import logo from "../assets/sd-computers-logo.svg";
import { useStore } from "../store/StoreContext.jsx";

/**
 * Consistent site footer shown on every storefront page.
 * Uses real router links so navigation never reloads the app.
 */
export default function Footer() {
  const { user } = useStore();

  const shopLinks = [
    { label: "Shop All", to: "/search" },
    { label: "Processors", to: "/category/processors" },
    { label: "Graphics Cards", to: "/category/graphics-cards-gpu" },
    { label: "Motherboards", to: "/category/motherboards" },
    { label: "Memory (RAM)", to: "/category/ram" },
    { label: "Storage", to: "/category/storage" },
    { label: "Monitors", to: "/category/monitors" },
    { label: "Peripherals", to: "/category/peripherals" },
  ];

  const accountLinks = user
    ? [
        { label: "My Profile", to: "/profile" },
        { label: "My Orders", to: "/orders" },
        { label: "Cart", to: "/cart" },
        { label: "Wishlist", to: "/wishlist" },
      ]
    : [
        { label: "Login", to: "/login" },
        { label: "Create Account", to: "/register" },
        { label: "Cart", to: "/cart" },
        { label: "Wishlist", to: "/wishlist" },
      ];

  const helpLinks = [
    { label: "Contact Us", to: "/contact" },
    { label: "About Us", to: "/about" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Track Orders", to: "/orders" },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img className="brand-logo" src={logo} alt="SD Computers logo" />
          <div>
            <strong>SD COMPUTERS</strong>
            <small>BUILD YOUR LEGEND</small>
          </div>
          <p>
            Your trusted destination for genuine PC components, peripherals and
            complete custom builds. Cash on Delivery available across India.
          </p>
        </div>

        <nav className="footer-links" aria-label="Shop">
          <h4>Shop</h4>
          {shopLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-links" aria-label="Account">
          <h4>Account</h4>
          {accountLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <nav className="footer-links" aria-label="Help">
          <h4>Help &amp; Info</h4>
          {helpLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="footer-note">
          <h4>Payments Accepted</h4>
          <div className="payment-icons">
            {["VISA", "MasterCard", "UPI", "G Pay"].map((method) => (
              <span key={method}>{method}</span>
            ))}
          </div>
          <small className="footer-cod">
            COD available on all orders — online payments coming soon.
          </small>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SD Computers. All rights reserved.
      </div>
    </footer>
  );
}