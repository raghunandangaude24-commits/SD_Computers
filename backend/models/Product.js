import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * A product sold on the store.
 *
 * IMPORTANT: this model must mirror the `products` table in
 * backend/sql/schema.sql — brand / category are plain string columns,
 * prices are stored as old_price, and `facets` is a real JSON column
 * used by structured filters (DDR4/DDR5, VRAM, SSD/HDD, ...).
 * sequelize.sync() recreates this table on a fresh database, so if this
 * model drifts from schema.sql the API breaks with unknown-column errors.
 */
const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "",
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    old_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    // Numeric percent (e.g. 16). Legacy rows may hold "16% OFF" —
    // the API mapper normalizes both shapes.
    discount: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // JSON array string (e.g. '["8GB GDDR6","128-bit","DLSS 3"]').
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Structured facet keys used for filtering (JSON column).
    facets: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 0,
    },
    review_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    popular: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;