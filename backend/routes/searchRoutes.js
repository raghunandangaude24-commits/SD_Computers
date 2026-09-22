import { Router } from "express";
import { search } from "../controllers/searchController.js";

const router = Router();

// Public search endpoint — the existing Search Results page works
// without authentication, so search stays public.
router.get("/", search);

export default router;