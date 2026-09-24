import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * Product categories (e.g. "Graphics Cards (GPU)") with slugs for
 * /category/:slug routing, marketing copy and tile images.
 */
const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    tableName: "categories",
    timestamps: true,
  }
);

export default Category;