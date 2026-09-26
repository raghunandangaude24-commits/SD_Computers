import { DataTypes } from "sequelize";

import sequelize from "../config/database.js";

/**
 * An order placed by a user. Shipping info is snapshot per order, and
 * payment/order status track fulfilment.
 */
const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    shipping_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    shipping_phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    shipping_address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    shipping_city: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    shipping_state: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    shipping_pincode: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "cod",
    },
    payment_status: {
      type: DataTypes.ENUM("pending", "paid", "failed", "refunded", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    order_status: {
      type: DataTypes.ENUM("pending", "confirmed", "shipped", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "orders",
    timestamps: true,
  }
);

export default Order;