import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { testConnection } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import {
  notFoundHandler,
  errorHandler,
} from "./middleware/errorMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from the backend folder no matter where the server is started.
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env") });

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

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "SD Computers API is running" });
});
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);

// --- 404 + centralized error handling ---
app.use(notFoundHandler);
app.use(errorHandler);

// --- Startup ---
const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_SECRET) {
    console.warn("[warn] JWT_SECRET is not set — using an insecure development default.");
  }

  try {
    const result = await testConnection();
    console.log("[db] MySQL connection OK", result);
  } catch (err) {
    console.error("[db] Could not connect to MySQL:", err.message);
    console.error("[db] Check DB_HOST / DB_USER / DB_PASSWORD / DB_NAME in backend/.env");
  }

  app.listen(PORT, () => {
    console.log(`[server] API listening on http://localhost:${PORT}`);
    console.log(`[server] Allowed CORS origin: ${process.env.NODE_ENV === "production" ? clientUrl : "* (development)"}`);
  });
}

start();