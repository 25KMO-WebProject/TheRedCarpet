import { Router } from "express";

import {
  getAllReviewsController,
  createReviewController,
} from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/reviews/:movieId", getAllReviewsController);

router.post("/reviews", requireAuth, createReviewController);

export default router;
