import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * Product brands (e.g. "MSI", "Gigabyte", "ASUS").
 * createdAt / updatedAt are managed automatically by Sequelize timestamps.
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
  },
  {
    tableName: "brands",
    timestamps: true,
  }
);

export default Brand;