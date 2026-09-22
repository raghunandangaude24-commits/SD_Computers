import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * Product categories (e.g. "Graphics Cards (GPU)").
 * createdAt / updatedAt are managed automatically by Sequelize timestamps.
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
  },
  {
    tableName: "categories",
    timestamps: true,
  }
);

export default Category;