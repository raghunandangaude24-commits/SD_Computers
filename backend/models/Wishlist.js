import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/** One wishlist per authenticated user. */
const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "wishlists",
    timestamps: true,
  }
);

export default Wishlist;