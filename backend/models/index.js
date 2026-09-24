import sequelize from "../config/database.js";

import Brand from "./Brand.js";
import Cart from "./Cart.js";
import CartItem from "./CartItem.js";
import Category from "./Category.js";
import ContactMessage from "./ContactMessage.js";
import Order from "./Order.js";
import OrderItem from "./OrderItem.js";
import Product from "./Product.js";
import ProductImage from "./ProductImage.js";
import Review from "./Review.js";
import User from "./User.js";
import Wishlist from "./Wishlist.js";
import WishlistItem from "./WishlistItem.js";

// --- Relationships ------------------------------------------------------
// These mirror the foreign keys in backend/sql/schema.sql. They exist so
// sequelize.sync() creates tables in the correct order on a fresh
// database. All API queries go through the mysql2 pool in config/db.js.
//
// The schema stores brand and category as plain string columns on
// products — the categories/brands tables are lookup tables, so no
// products↔categories/products↔brands associations are defined.

Product.hasMany(ProductImage, { foreignKey: "product_id", as: "images" });
ProductImage.belongsTo(Product, { foreignKey: "product_id", as: "product" });

User.hasOne(Cart, { foreignKey: "user_id", as: "cart" });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });
Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id", as: "cart" });
CartItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

User.hasOne(Wishlist, { foreignKey: "user_id", as: "wishlist" });
Wishlist.belongsTo(User, { foreignKey: "user_id", as: "user" });
Wishlist.hasMany(WishlistItem, { foreignKey: "wishlist_id", as: "items" });
WishlistItem.belongsTo(Wishlist, { foreignKey: "wishlist_id", as: "wishlist" });
WishlistItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

Product.hasMany(Review, { foreignKey: "product_id", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Review.belongsTo(User, { foreignKey: "user_id", as: "user" });

// --- Exports -------------------------------------------------------------
export {
  sequelize,
  User,
  Product,
  Category,
  Brand,
  ProductImage,
  Cart,
  CartItem,
  Wishlist,
  WishlistItem,
  Order,
  OrderItem,
  Review,
  ContactMessage,
};