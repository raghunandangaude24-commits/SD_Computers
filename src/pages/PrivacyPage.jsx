import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

/**
 * Privacy Policy — a static storefront page. This is a demonstration site:
 * keep the wording factual and simple.
 */
export default function PrivacyPage() {
  return (
    <div className="listing-page content-page">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Privacy Policy" }]}
      />

      <div className="page-heading">
        <h1>Privacy Policy</h1>
        <p>Last updated: September 2026</p>
      </div>

      <section className="prose">
        <h2>Information We Collect</h2>
        <p>
          To create an account and process orders we collect your name, email
          address, phone number and delivery address. Payment details for Cash
          on Delivery orders are not collected or stored online.
        </p>

        <h2>How We Use Your Information</h2>
        <p>
          Your details are used to identify your account, deliver your orders,
          respond to support requests and keep your cart and wishlist synced.
          We do not sell your personal information to anyone.
        </p>

        <h2>Cookies & Local Storage</h2>
        <p>
          We use browser local storage to remember your signed-in session (a
          token) and your guest cart/wishlist while you are not signed in.
          Returning guests can clear this at any time by clearing browser data.
        </p>

        <h2>Data Security</h2>
        <p>
          Passwords are hashed before storage and are never stored in plain
          text. API access is authenticated with session tokens and every
          action is checked against your account.
        </p>

        <h2>Your Choices</h2>
        <p>
          You can review and update your profile information at any time from
          your account page. For any privacy questions,{" "}
          <Link to="/contact">contact us</Link>.
        </p>
      </section>
    </div>
  );
}