import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * A product sold on the store.
 * Belongs to one Category and one Brand (see models/index.js).
 * createdAt / updatedAt are managed automatically by Sequelize timestamps.
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    originalPrice: {
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
    stock: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "categories", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    brandId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: { model: "brands", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;