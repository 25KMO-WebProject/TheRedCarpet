import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

import {
  getFavoritesController,
  addFavoriteController,
  deleteFavoriteController,
  createFavoriteShareController,
  getSharedFavoritesController,
} from "../controllers/favoriteController.js";

const router = Router();

// All favorite endpoints require authentication.
router.get("/favorites", requireAuth, getFavoritesController);

router.post("/favorites", requireAuth, addFavoriteController);

router.delete(
  "/favorites/:mediaType/:tmdbId",
  requireAuth,
  deleteFavoriteController,
);

// Create a share link for the authenticated user's favorites.
router.post("/favorites/share", requireAuth, createFavoriteShareController);

// Public endpoint for viewing a shared favorites list.
router.get("/favorites/shared/:shareToken", getSharedFavoritesController);

export default router;
