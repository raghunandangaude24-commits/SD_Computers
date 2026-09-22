/**
 * Creates the student_management database (if missing), creates the
 * tables from sql/schema.sql, and seeds the products catalog.
 *
 * Run from backend/:   npm run init-db
 */
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "student_management";

async function init() {
  // Connect without selecting a database so we can create it if needed.
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  await connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await connection.query(`USE \`${DB_NAME}\``);

  const schema = readFileSync(
    path.join(__dirname, "..", "sql", "schema.sql"),
    "utf8"
  );
  await connection.query(schema);

  await connection.end();
  console.log(`[db] ${DB_NAME} is ready (tables created + products seeded).`);
}

init().catch((err) => {
  console.error("[db] init failed:", err.message);
  process.exitCode = 1;
});