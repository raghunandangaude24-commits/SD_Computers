import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { Sequelize } from "sequelize";

// Load backend/.env regardless of the working directory the server is started from.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

/**
 * Shared Sequelize instance for the MySQL database.
 *
 * All connection values come from environment variables (see .env):
 *   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
 *
 * No credentials are hardcoded here. The database name falls back to the
 * project database ("SD_Computers") only when DB_NAME is not set.
 */
const sequelize = new Sequelize(
  process.env.DB_NAME || "SD_Computers",
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
      timestamps: true,
      // Maps Sequelize's createdAt/updatedAt attributes to the
      // created_at/updated_at columns used by backend/sql/schema.sql
      // so sequelize.sync() and the SQL schema stay in agreement.
      underscored: true,
    },
  }
);

export default sequelize;