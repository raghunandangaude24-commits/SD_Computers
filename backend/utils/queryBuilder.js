import pool from "../config/db.js";

/**
 * Shared product list/search query builder.
 *
 * Both GET /api/products (category + filter pages) and GET /api/search
 * (search results) use this single builder so filtering, sorting and
 * pagination behave identically everywhere. All values are parameterized;
 * the only interpolated fragments are whitelisted.
 */

/** Whitelisted sort options — user input is mapped through this map. */
export const SORT_MAP = {
  relevance: "p.id ASC",
  newest: "p.id DESC",
  price_asc: "p.price ASC",
  price_desc: "p.price DESC",
  name_asc: "p.name ASC",
  name_desc: "p.name DESC",
  rating: "p.rating DESC, p.review_count DESC, p.id ASC",
  popular: "p.popular DESC, p.rating DESC, p.id ASC",
};

/** Columns selected for every product row (must satisfy toProductJson). */
export const PRODUCT_COLUMNS = `p.id, p.slug, p.name, p.brand, p.category, p.price,
  p.old_price, p.discount, p.image, p.description, p.specifications, p.facets, p.details,
  p.stock, p.rating, p.review_count, p.featured, p.popular`;

/**
 * Facet keys that may be used for `facet_<key>=<value>` filtering.
 * The JSON path is built only from this whitelist, so arbitrary
 * keys can never reach the SQL.
 */
export const FACET_KEYS = new Set([
  "chipset",
  "socket",
  "cores",
  "vram",
  "dimm",
  "capacity",
  "speed",
  "storage_type",
  "form_factor",
  "type",
  "size",
  "panel",
  "refresh",
  "wattage",
  "certification",
  "modular",
  "rgb",
  "side_panel",
  "connection",
  "switch",
]);

/** Parse a comma-separated brand list coming from the frontend. */
export function parseBrands(raw) {
  if (!raw) return [];
  const list = Array.isArray(raw) ? raw : String(raw).split(",");
  return [...new Set(list.map((b) => String(b).trim()).filter(Boolean))];
}

/** Pull every `facet_<key>` parameter out of a query string. */
export function parseFacetParams(query = {}) {
  const facets = {};
  Object.keys(query).forEach((key) => {
    if (key.startsWith("facet_")) {
      const facetKey = key.slice("facet_".length);
      if (FACET_KEYS.has(facetKey)) {
        facets[facetKey] = String(query[key]).trim();
      }
    }
  });
  return facets;
}

function parsePositiveInt(value, fallback) {
  const parsed = parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

/**
 * Split a user query into searchable words: lower-cased, de-duplicated,
 * very short fragments dropped (a single letter matches nearly every row)
 * and capped so a pasted paragraph cannot build unbounded SQL.
 */
function tokenizeQuery(q) {
  const tokens = String(q ?? "")
    .toLowerCase()
    .split(/[^a-z0-9.]+/)
    .filter((token) => token.length >= 2);
  return [...new Set(tokens)].slice(0, 8);
}

/**
 * The words actually matched against the catalog. Falls back to the raw
 * phrase when tokenizing removes everything (e.g. a 1-character query).
 */
function queryTerms(q) {
  const tokens = tokenizeQuery(q);
  if (tokens.length > 0) return tokens;
  const raw = String(q ?? "").trim().toLowerCase();
  return raw ? [raw] : [];
}

/** Escape LIKE metacharacters so user input is matched literally. */
function escapeLike(value) {
  return String(value).replace(/[\\%_]/g, (char) => `\\${char}`);
}

/** A single `%term%` placeholder-bound pattern. */
function likePattern(term) {
  return `%${escapeLike(term)}%`;
}

/**
 * WHERE fragment for a tokenized query: every word (AND) or any word
 * (OR) must appear in the name, brand, category, specs or description.
 * Matching per word instead of matching the whole phrase is what makes
 * queries such as "ssd 1tb" or "rtx graphics" return real results.
 * Returns { sql, args } so the caller can bind parameters in order.
 */
function searchCondition(terms, matchAll) {
  const perTerm = terms.map(
    () =>
      "(LOWER(p.name) LIKE ? OR LOWER(p.brand) LIKE ? OR LOWER(p.category) LIKE ? OR LOWER(p.specifications) LIKE ? OR LOWER(p.description) LIKE ?)"
  );

  return {
    sql: `(${perTerm.join(matchAll ? " AND " : " OR ")})`,
    args: terms.flatMap((term) => {
      const like = likePattern(term);
      return [like, like, like, like, like];
    }),
  };
}

/**
 * Relevance score expression: name hits outrank brand hits, which outrank
 * category, specs and description. Products matching more words therefore
 * always sort before loosely related ones. Returns { expression, args }.
 */
function relevanceExpression(terms) {
  const args = [];
  const perTerm = terms.map((term) => {
    const like = likePattern(term);
    args.push(like, like, like, like, like);
    return `(CASE WHEN LOWER(p.name) LIKE ? THEN 8 ELSE 0 END
      + CASE WHEN LOWER(p.brand) LIKE ? THEN 5 ELSE 0 END
      + CASE WHEN LOWER(p.category) LIKE ? THEN 4 ELSE 0 END
      + CASE WHEN LOWER(p.specifications) LIKE ? THEN 3 ELSE 0 END
      + CASE WHEN LOWER(p.description) LIKE ? THEN 1 ELSE 0 END)`;
  });

  return { expression: perTerm.join(" + "), args };
}

/**
 * Run a product query and return { rows, pagination, brands }.
 *
 * @param {Object} params
 * @param {string} [params.q]             text search
 * @param {string} [params.category]      exact category name
 * @param {string[]} [params.brands]      brand names
 * @param {number} [params.priceMin]      inclusive lower price bound
 * @param {number} [params.priceMax]      inclusive upper price bound
 * @param {number} [params.rating]        minimum rating
 * @param {boolean} [params.inStock]      only items with stock > 0
 * @param {boolean} [params.featured]     only featured items
 * @param {boolean} [params.popular]      only popular items
 * @param {number} [params.exclude]       product id to exclude
 * @param {Object} [params.facets]        structured facet key/value filters
 * @param {string} [params.sort]          whitelisted sort key
 * @param {number} [params.page]          1-based page number
 * @param {number} [params.limit]         page size (capped at 50)
 * @param {boolean} [params.matchAll]     require every query word (default true);
 *                                        automatically relaxed to "any word"
 *                                        when a strict match would return nothing
 */
export async function queryProducts(params = {}) {
  const {
    q,
    category,
    brands,
    priceMin,
    priceMax,
    rating,
    inStock,
    featured,
    popular,
    exclude,
    facets = {},
    sort = "relevance",
    matchAll = true,
  } = params;

  const page = parsePositiveInt(params.page, 1);
  const limit = Math.min(parsePositiveInt(params.limit, 12), 50);
  const offset = (page - 1) * limit;

  // Conditions shared by the results query and the brand facet query
  // (the brand filter itself is NOT shared so every brand stays visible).
  const base = [];
  const baseArgs = [];

  const terms = q ? queryTerms(q) : [];

  if (terms.length > 0) {
    const condition = searchCondition(terms, matchAll);
    base.push(condition.sql);
    baseArgs.push(...condition.args);
  }

  if (category) {
    base.push("p.category = ?");
    baseArgs.push(category);
  }

  if (priceMin !== null && priceMin !== undefined && !Number.isNaN(priceMin)) {
    base.push("p.price >= ?");
    baseArgs.push(priceMin);
  }

  if (priceMax !== null && priceMax !== undefined && !Number.isNaN(priceMax)) {
    base.push("p.price <= ?");
    baseArgs.push(priceMax);
  }

  if (rating !== null && rating !== undefined && !Number.isNaN(rating)) {
    base.push("p.rating >= ?");
    baseArgs.push(rating);
  }

  if (inStock) {
    base.push("p.stock > 0");
  }

  if (featured) {
    base.push("p.featured = 1");
  }

  if (popular) {
    base.push("p.popular = 1");
  }

  for (const [key, value] of Object.entries(facets)) {
    if (!FACET_KEYS.has(key)) continue;
    base.push(`p.facets->>'$.${key}' = ?`);
    baseArgs.push(String(value));
  }

  // Results-only conditions (brands + exclusion).
  const conditions = [...base];
  const args = [...baseArgs];

  if (brands && brands.length > 0) {
    conditions.push(`p.brand IN (${brands.map(() => "?").join(", ")})`);
    args.push(...brands);
  }

  if (exclude) {
    conditions.push("p.id <> ?");
    args.push(exclude);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const baseWhere = base.length > 0 ? `WHERE ${base.join(" AND ")}` : "";

  let orderBy = SORT_MAP[sort] ?? SORT_MAP.relevance;
  let relevanceArgs = [];
  if (sort === "relevance" && terms.length > 0) {
    const relevance = relevanceExpression(terms);
    orderBy = `${relevance.expression} DESC, p.rating DESC, p.review_count DESC, p.id ASC`;
    relevanceArgs = relevance.args;
  }

  const [countRows] = await pool.query(
    `SELECT COUNT(*) AS total FROM products p ${where}`,
    args
  );
  const total = Number(countRows[0].total);
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // "ssd 1tb" matches, but "gaming keyboard" may not — relax the query to
  // "any of these words" instead of showing an empty result set. The
  // relevance ordering above keeps the closest matches on top, and the
  // flag guard keeps this from recursing.
  if (total === 0 && matchAll && terms.length > 1) {
    return queryProducts({ ...params, matchAll: false });
  }

  const [rows] = await pool.query(
    `SELECT ${PRODUCT_COLUMNS}
     FROM products p
     ${where}
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...args, ...relevanceArgs, limit, offset]
  );

  const [brandRows] = await pool.query(
    `SELECT p.brand AS name, COUNT(*) AS count
     FROM products p
     ${baseWhere}
     GROUP BY p.brand
     ORDER BY count DESC, p.brand ASC`,
    baseArgs
  );

  return {
    rows,
    pagination: { page, limit, total, totalPages },
    brands: brandRows.map((row) => ({
      name: row.name,
      count: Number(row.count),
    })),
  };
}