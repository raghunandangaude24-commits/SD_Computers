import { buildProductDetails } from "./utils/productDetails.js";

const all = [];
for (let page = 1; page <= 8; page++) {
  const res = await fetch(`http://localhost:5000/api/products?limit=50&page=${page}`);
  const data = await res.json();
  all.push(...data.products);
  if (page >= data.pagination.totalPages) break;
}

let thin = 0;
for (const p of all) {
  const rows = buildProductDetails(p);
  if (rows.length < 3) thin++;
  console.log(
    `\n[${p.category}] ${p.name}  (${rows.length})\n  ` +
      rows.map((r) => `${r.label}: ${r.value}`).join(" | ")
  );
}
console.log(`\n--- ${all.length} products, ${thin} with fewer than 3 detail rows`);
