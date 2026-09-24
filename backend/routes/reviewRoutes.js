import { Router } from "express";
import {
  listReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

// Public: read reviews for a product.
router.get("/:productId", listReviews);

// Protected: write reviews.
router.post("/:productId", authenticate, createReview);
router.put("/:id", authenticate, updateReview);
router.delete("/:id", authenticate, deleteReview);

export default router;