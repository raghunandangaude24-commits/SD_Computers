import { Router } from "express";
import { getProductById } from "../controllers/productController.js";

const router = Router();

// Public single-product endpoint for the Product Detail page.
router.get("/:id", getProductById);

export default router;