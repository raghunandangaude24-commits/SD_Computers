import { Link } from "react-router-dom";
import Breadcrumbs from "../components/Breadcrumbs.jsx";

const VALUES = [
  {
    icon: "♢",
    title: "Genuine Products",
    text: "Every component we sell is sourced from authorised distributors with India warranty.",
  },
  {
    icon: "▣",
    title: "Expert Guidance",
    text: "Not sure what fits your budget or build? Our PC experts help you pick the right parts.",
  },
  {
    icon: "◒",
    title: "Fast, Safe Delivery",
    text: "Carefully packed orders shipped within 24 hours, with Cash on Delivery available.",
  },
];

/**
 * About page — a static storefront page (no backend data needed).
 */
export default function AboutPage() {
  return (
    <div className="listing-page content-page">
      <Breadcrumbs
        items={[{ label: "Home", to: "/" }, { label: "About Us" }]}
      />

      <div className="page-heading">
        <h1>About SD Computers</h1>
        <p>
          SD Computers is your trusted destination for genuine PC components,
          peripherals and complete custom builds — serving gamers, creators and
          professionals across India.
        </p>
      </div>

      <section className="prose">
        <h2>Our Story</h2>
        <p>
          What started as a small counter in a local computer market has grown
          into a full-fledged storefront for PC enthusiasts. We believe a great
          PC build shouldn't be risky or confusing: every product is tested,
          genuine and backed by official Indian warranty.
        </p>
        <p>
          From entry-level office rigs to high-end 4K gaming and rendering
          workstations, we help you choose components that actually fit your
          needs and your budget — no upselling, no guessing.
        </p>
      </section>

      <section className="about-values">
        {VALUES.map((value) => (
          <div className="about-value" key={value.title}>
            <span className="about-value-icon">{value.icon}</span>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </div>
        ))}
      </section>

      <section className="prose">
        <h2>Why Shop With Us</h2>
        <ul>
          <li>100% genuine products with manufacturer warranty</li>
          <li>Cash on Delivery available on all orders</li>
          <li>Honest pricing in Indian Rupees with all taxes included</li>
          <li>7-day replacement on eligible items</li>
          <li>Helpful support for your entire build journey</li>
        </ul>
        <p>
          Ready to start building?{" "}
          <Link to="/search">Browse the catalog</Link> or{" "}
          <Link to="/contact">talk to our team</Link>.
        </p>
      </section>
    </div>
  );
}