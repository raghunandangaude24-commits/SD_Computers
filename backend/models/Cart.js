import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/** One active cart per authenticated user. */
const Cart = sequelize.define(
  "Cart",
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
    tableName: "carts",
    timestamps: true,
  }
);

export default Cart;