import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * Product brands (e.g. "MSI", "Gigabyte", "ASUS") with slugs.
 */
const Brand = sequelize.define(
  "Brand",
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
  },
  {
    tableName: "brands",
    timestamps: true,
  }
);

export default Brand;