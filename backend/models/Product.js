import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * A product sold on the store.
 *
 * IMPORTANT: this model must mirror the `products` table in
 * backend/sql/schema.sql (brand / category are plain string columns,
 * and prices are stored as old_price). The API controllers and the
 * frontend consume exactly those columns, and `sequelize.sync()`
 * recreates this table on a fresh database — so if this model drifts
 * from schema.sql, the API breaks with unknown-column errors.
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
    // Kept as a short string ("8% OFF") to match the format already
    // displayed by the existing UI catalog data.
    discount: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
    },
    // JSON array string (e.g. '["8GB GDDR6","128-bit","DLSS 3"]').
    specifications: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;