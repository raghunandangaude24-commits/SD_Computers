import { Router } from "express";
import {
  getProfile,
  updateProfile,
  updatePassword,
} from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = Router();

router.use(authenticate);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/password", updatePassword);

export default router;