import { Router } from "express";
import {
  createOrder,
  listOrders,
  getOrderById,
} from "../controllers/orderController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

// Orders are always user-scoped.
router.use(authenticate);

router.get("/", listOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);

export default router;