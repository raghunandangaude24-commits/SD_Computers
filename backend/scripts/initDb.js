/**
 * Creates the SD_Computers database (if missing), applies the canonical
 * schema from sql/schema.sql, migrates any pre-existing tables so they
 * match (adds missing columns only — never drops data), loads the seed
 * catalog from sql/seed.sql and creates the admin account.
 *
 * Run from backend/:   npm run init-db
 */
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import dotenv from "dotenv";
import { buildProductDetails } from "../utils/productDetails.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT) || 3306;
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "SD_Computers";

/** True when `column` already exists on `table` in the target database. */
async function columnExists(connection, table, column) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS n FROM information_schema.columns
     WHERE table_schema = ? AND table_name = ? AND column_name = ?`,
    [DB_NAME, table, column]
  );
  return Number(rows[0].n) > 0;
}

/** True when `indexName` already exists on `table`. */
async function indexExists(connection, table, indexName) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS n FROM information_schema.statistics
     WHERE table_schema = ? AND table_name = ? AND index_name = ?`,
    [DB_NAME, table, indexName]
  );
  return Number(rows[0].n) > 0;
}

/** ALTER TABLE ... ADD COLUMN when the column is missing (idempotent). */
async function ensureColumn(connection, table, column, definition) {
  if (await columnExists(connection, table, column)) return;
  await connection.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`);
  console.log(`  [migrate] + ${table}.${column}`);
}

/**
 * Bring an old first-schema database in line with the current schema
 * without dropping anything. Only additive changes are made.
 */
async function migrateLegacySchema(connection) {
  const usersExists = await tableExists(connection, "users");
  if (!usersExists) return; // fresh database — schema.sql already created it

  console.log("  [migrate] reconciling pre-existing tables...");

  // users: role + snake_case timestamps (legacy rows used createdAt).
  await ensureColumn(
    connection,
    "users",
    "role",
    "ENUM('customer','admin') NOT NULL DEFAULT 'customer'"
  );
  await ensureColumn(
    connection,
    "users",
    "created_at",
    "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
  );
  await ensureColumn(
    connection,
    "users",
    "updated_at",
    "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );

  // products: new catalog fields.
  await ensureColumn(connection, "products", "slug", "VARCHAR(300) NOT NULL DEFAULT ''");
  await ensureColumn(connection, "products", "description", "TEXT NULL");
  await ensureColumn(connection, "products", "facets", "JSON NULL");
  await ensureColumn(connection, "products", "details", "JSON NULL");
  await ensureColumn(connection, "products", "stock", "INT NOT NULL DEFAULT 10");
  await ensureColumn(connection, "products", "rating", "DECIMAL(3,2) NOT NULL DEFAULT 0.00");
  await ensureColumn(connection, "products", "review_count", "INT NOT NULL DEFAULT 0");
  await ensureColumn(connection, "products", "featured", "TINYINT(1) NOT NULL DEFAULT 0");
  await ensureColumn(connection, "products", "popular", "TINYINT(1) NOT NULL DEFAULT 0");
  await ensureColumn(
    connection,
    "products",
    "created_at",
    "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
  );
  await ensureColumn(
    connection,
    "products",
    "updated_at",
    "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );

  // Unique product name index → makes the seed idempotent (INSERT IGNORE).
  if (!(await indexExists(connection, "products", "uq_products_name"))) {
    try {
      await connection.query(
        "ALTER TABLE products ADD UNIQUE INDEX uq_products_name (name)"
      );
      console.log("  [migrate] + products.uq_products_name");
    } catch {
      console.log("  [migrate] skipped products.uq_products_name (duplicate names exist)");
    }
  }

  // Legacy discount column was a VARCHAR like '8% OFF' — the API mapper
  // normalizes both shapes, so the type is left untouched here.

  // categories / brands: old schema only had (id, name) — add slug etc.
  await ensureColumn(connection, "categories", "slug", "VARCHAR(120) NOT NULL DEFAULT ''");
  await ensureColumn(connection, "categories", "description", "TEXT NULL");
  await ensureColumn(connection, "categories", "image", "VARCHAR(500) NOT NULL DEFAULT ''");
  await ensureColumn(
    connection,
    "categories",
    "created_at",
    "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
  );
  await ensureColumn(
    connection,
    "categories",
    "updated_at",
    "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );
  await ensureColumn(connection, "brands", "slug", "VARCHAR(120) NOT NULL DEFAULT ''");
  await ensureColumn(
    connection,
    "brands",
    "created_at",
    "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP"
  );
  await ensureColumn(
    connection,
    "brands",
    "updated_at",
    "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );

  // Legacy seed artifacts: dead PNG images + duplicate names.
  await cleanupLegacyData(connection);
}

/**
 * Clean up rows left over from the very first seed: point legacy PNG
 * image paths at the category SVG placeholders and drop exact duplicate
 * product names (case differences slip through INSERT IGNORE).
 * Idempotent — safe to re-run.
 */
async function cleanupLegacyData(connection) {
  // Legacy products referenced /products/<name>.png which 404s — point
  // them at the category SVG placeholder from the categories table.
  const [pngRows] = await connection.query(
    "SELECT COUNT(*) AS n FROM products WHERE image <> '' AND image NOT LIKE '%.svg'"
  );
  if (Number(pngRows[0].n) > 0) {
    await connection.query(
      `UPDATE products p
       JOIN categories c ON c.name = p.category
       SET p.image = CONCAT('/products/', c.slug, '.svg')
       WHERE p.image <> '' AND p.image NOT LIKE '%.svg'`
    );
    console.log(`  [migrate] repointed ${Number(pngRows[0].n)} legacy product image(s) to category SVGs`);
  }

  // Remove exact duplicates introduced by naming-case differences, keeping
  // the highest id (the freshly seeded one).
  const [dupRows] = await connection.query(
    `SELECT COUNT(*) AS n FROM (
       SELECT LOWER(name) AS keyname FROM products GROUP BY LOWER(name) HAVING COUNT(*) > 1
     ) d`
  );
  if (Number(dupRows[0].n) > 0) {
    await connection.query(
      `DELETE p1 FROM products p1
       JOIN products p2 ON LOWER(p1.name) = LOWER(p2.name) AND p1.id < p2.id`
    );
    console.log(`  [migrate] removed ${Number(dupRows[0].n)} duplicate product name group(s)`);
  }
}

/** True when `table` exists in the target database. */
async function tableExists(connection, table) {
  const [rows] = await connection.query(
    `SELECT COUNT(*) AS n FROM information_schema.tables
     WHERE table_schema = ? AND table_name = ?`,
    [DB_NAME, table]
  );
  return Number(rows[0].n) > 0;
}

/** Create the admin account used to manage products/categories/brands. */
async function seedAdmin(connection) {
  const email = process.env.ADMIN_EMAIL || "admin@sdcomputers.local";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const hashed = await bcrypt.hash(password, 10);

  const [result] = await connection.query(
    `INSERT IGNORE INTO users (name, email, phone, password, role)
     VALUES (?, ?, ?, ?, 'admin')`,
    ["Store Admin", email, "0000000000", hashed]
  );

  if (result.affectedRows > 0) {
    console.log(`  [seed] admin account created: ${email} (role: admin)`);
  } else {
    console.log("  [seed] admin account already exists — skipped");
  }
}

async function init() {
  // --- Connection A: create DB + apply schema + migrate ---
  // Connect without selecting a database so we can create it if needed.
  const connectionA = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  try {
    await connectionA.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await connectionA.query(`USE \`${DB_NAME}\``);

    console.log(`[db] Using database \`${DB_NAME}\``);

    // 1. Canonical schema (CREATE TABLE IF NOT EXISTS — non-destructive).
    const schema = readFileSync(path.join(__dirname, "..", "sql", "schema.sql"), "utf8");
    await connectionA.query(schema);
    console.log("[db] schema applied (tables created)");

    // 2. Bring pre-existing tables up to date.
    await migrateLegacySchema(connectionA);
  } finally {
    await connectionA.end();
  }

  // --- Connection B: seed + admin (a fresh connection picks up the
  // migrated table definitions — MySQL's table cache can serve stale
  // metadata for the same table right after a burst of ALTERs). ---
  const connectionB = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true,
  });

  try {
    // The details column must exist before the catalog is seeded and
    // backfilled (schema.sql creates it on a fresh database; this is the
    // safety net for databases created by an older schema.sql).
    await ensureColumn(connectionB, "products", "details", "JSON NULL");

    // 3. Seed catalog (INSERT IGNORE — safe to re-run).
    const seed = readFileSync(path.join(__dirname, "..", "sql", "seed.sql"), "utf8");
    await connectionB.query(seed);
    console.log("[db] catalog seeded (categories, brands, products)");

    // 4. Product detail tables (cores/threads/GHz, DDR generation + MHz,
    //    VRAM, panel specs ...) — computed from each row's own data and
    //    only ever written when the column is still NULL, so curated
    //    values are never overwritten. Idempotent by construction.
    const [pending] = await connectionB.query(
      `SELECT id, name, category, description, specifications, facets
         FROM products WHERE details IS NULL`
    );
    for (const row of pending) {
      await connectionB.query("UPDATE products SET details = ? WHERE id = ?", [
        JSON.stringify(buildProductDetails(row)),
        row.id,
      ]);
    }
    if (pending.length > 0) {
      console.log(`  [seed] product details built for ${pending.length} product(s)`);
    }

    // 5. Admin account.
    await seedAdmin(connectionB);

    // 6. Summary.
    const [productCount] = await connectionB.query("SELECT COUNT(*) AS n FROM products");
    const [categoryCount] = await connectionB.query("SELECT COUNT(*) AS n FROM categories");
    const [brandCount] = await connectionB.query("SELECT COUNT(*) AS n FROM brands");
    const [userCount] = await connectionB.query("SELECT COUNT(*) AS n FROM users");
    console.log(
      `[db] ready — ${Number(categoryCount[0].n)} categories, ${Number(brandCount[0].n)} brands, ` +
        `${Number(productCount[0].n)} products, ${Number(userCount[0].n)} users`
    );
  } finally {
    await connectionB.end();
  }
}

init()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("[db] init failed:", err.message);
    process.exit(1);
  });