import sequelize from "../config/database.js";

import Brand from "./Brand.js";
import Category from "./Category.js";
import Product from "./Product.js";
import User from "./User.js";

// --- Relationships ------------------------------------------------------
// Only the requested relationships are defined here.

// Category 1—N Products
Category.hasMany(Product, { foreignKey: "categoryId" });
Product.belongsTo(Category, { foreignKey: "categoryId" });

// Brand 1—N Products
Brand.hasMany(Product, { foreignKey: "brandId" });
Product.belongsTo(Brand, { foreignKey: "brandId" });

// --- Exports -------------------------------------------------------------
export { sequelize, User, Product, Category, Brand };