import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from the backend folder no matter where the server is started.
dotenv.config({ path: path.join(__dirname, ".env") });

import { sequelize } from "./models/index.js";
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import deliveryRoutes from "./routes/deliveryRoutes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/errorMiddleware.js";

const app = express();

// --- CORS ---
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? clientUrl : true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Minimal security headers (dependency-free — helmet-style basics).
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "DENY");
  res.set("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "SD Computers API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/delivery", deliveryRoutes);

// --- 404 + centralized error handling ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Startup ---
const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET) {
    // Without a secret, login would crash at runtime (jwt.sign throws) —
    // refuse to start in production, warn in development.
    if (process.env.NODE_ENV === "production") {
      console.error("[server] JWT_SECRET must be set in production — refusing to start.");
      process.exit(1);
    }
    console.warn("[warn] JWT_SECRET is not set — using an insecure development default.");
  }

  try {
    await sequelize.authenticate();
    console.log("[db] MySQL connection OK");

    // Non-destructive: creates missing tables only, never forces or alters.
    // The full canonical schema (with indexes) lives in sql/schema.sql and
    // is applied by `npm run init-db`.
    await sequelize.sync();
    console.log("[db] Sequelize models synchronized");
  } catch (err) {
    console.error("[db] Could not connect to MySQL:", err.message);
    console.error("[db] Check DB_HOST / DB_PORT / DB_USER / DB_PASSWORD / DB_NAME in backend/.env");
    console.error("[db] Then run:  cd backend && npm run init-db");
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`);
    console.log(
      `[server] Allowed CORS origin: ${
        process.env.NODE_ENV === "production" ? clientUrl : "* (development)"
      }`
    );
  });
}

start();