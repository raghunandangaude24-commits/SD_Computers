import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/** A saved product inside a user's wishlist. */
const WishlistItem = sequelize.define(
  "WishlistItem",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    wishlist_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    tableName: "wishlist_items",
    timestamps: true,
  }
);

export default WishlistItem;