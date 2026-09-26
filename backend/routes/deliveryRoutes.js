import { Router } from "express";
import { checkPincode } from "../controllers/deliveryController.js";

const router = Router();

// Public delivery/serviceability lookup (product page "Check Delivery").
router.get("/check", checkPincode);

export default router;
