import sequelize from "../config/database.js";

import Brand from "./Brand.js";
import Category from "./Category.js";
import Product from "./Product.js";
import User from "./User.js";

// --- Relationships ------------------------------------------------------
// The schema (backend/sql/schema.sql) stores brand and category as plain
// string columns on products — there are no categories/brands join tables
// wired to products, so no associations are defined here. The Category and
// Brand models are kept for compatibility but are not referenced by the API.

// --- Exports -------------------------------------------------------------
export { sequelize, User, Product, Category, Brand };