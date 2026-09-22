import ProductCard from "./ProductCard.jsx";

/**
 * Consistent responsive grid of ProductCards. Every page that shows a
 * product list uses this so spacing and layout stay identical site-wide.
 */
export default function ProductGrid({ products = [] }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}