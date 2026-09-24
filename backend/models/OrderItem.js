import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * A line of an order. product_name / price / image are snapshots taken
 * at purchase time so order history stays correct even if the product
 * is edited or removed later. product_id is kept (nullable) for links.
 */
const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    product_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "",
    },
  },
  {
    tableName: "order_items",
    timestamps: true,
  }
);

export default OrderItem;