import logo from "../assets/sd-computers-logo.svg";

/**
 * Consistent site footer shown on every storefront page.
 */
export default function Footer() {
  const links = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/search" },
    { label: "Cart", href: "/cart" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "My Account", href: "/profile" },
  ];

  const go = (href) => () => {
    window.location.href = href;
  };

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
            complete custom builds.
          </p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <h4>Quick Links</h4>
          {links.map((link) => (
            <button key={link.href} type="button" onClick={go(link.href)}>
              {link.label}
            </button>
          ))}
        </nav>

        <div className="footer-note">
          <h4>100% Secure Payments</h4>
          <div className="payment-icons">
            {["VISA", "MasterCard", "G Pay", "PayPal"].map((method) => (
              <span key={method}>{method}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} SD Computers. All rights reserved.
      </div>
    </footer>
  );
}