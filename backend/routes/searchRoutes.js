import { Router } from "express";
import { search, listCategories } from "../controllers/searchController.js";

const router = Router();

// Public search endpoint — the Search Results page works without login.
router.get("/", search);

// Public category list used by the Home page category tiles/sidebar.
router.get("/categories", listCategories);

export default router;