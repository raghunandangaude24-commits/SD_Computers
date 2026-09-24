import { Router } from "express";
import {
  listBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandController.js";
import { authenticate, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", listBrands);

// Admin-only brand management.
router.post("/", authenticate, requireAdmin, createBrand);
router.put("/:id", authenticate, requireAdmin, updateBrand);
router.delete("/:id", authenticate, requireAdmin, deleteBrand);

export default router;