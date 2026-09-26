import { Router } from "express";
import {
  createOrder,
  listOrders,
  getOrderById,
  cancelOrder,
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

// Orders are always user-scoped.
router.use(authenticate);

router.get("/", listOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);
router.post("/:id/cancel", cancelOrder);

export default router;