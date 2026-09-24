import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

/**
 * Terms & Conditions — a static storefront page. This is a demonstration
 * site; wording is simple and factual.
 */
export default function TermsPage() {
  return (
    <div className="listing-page content-page">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "Terms & Conditions" }]}
      />

      <div className="page-heading">
        <h1>Terms &amp; Conditions</h1>
        <p>Last updated: September 2026</p>
      </div>

      <section className="prose">
        <h2>Orders & Payment</h2>
        <p>
          All orders are accepted subject to product availability. Prices are
          shown in Indian Rupees and include all applicable taxes. Delivery
          within India is free. The only online payment option currently
          available is Cash on Delivery (COD); you pay the order total in cash
          when your order is delivered.
        </p>

        <h2>Online Payment Methods</h2>
        <p>
          Card and UPI payment options are displayed as <em>coming soon</em> on
          the checkout page. Attempting to select them will not process any
          payment — they are clearly marked placeholders.
        </p>

        <h2>Delivery & Returns</h2>
        <p>
          Orders ship within 24 hours where the product is in stock. Eligible
          items may be replaced within 7 days of delivery if they arrive
          damaged or defective. Claims are subject to manufacturer warranty
          policies.
        </p>

        <h2>Account Responsibility</h2>
        <p>
          You are responsible for keeping your login credentials safe and for
          the activity that happens under your account. Orders are only
          visible to the account that placed them.
        </p>

        <h2>Questions</h2>
        <p>
          If you have any questions about these terms,{" "}
          <Link to="/contact">contact us</Link> and we'll be happy to help.
        </p>
      </section>
    </div>
  );
}