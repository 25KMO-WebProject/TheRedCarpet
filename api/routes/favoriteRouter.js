import { Router } from "express";
import jwt from "jsonwebtoken";

import {
  getFavoritesController,
  addFavoriteController,
  deleteFavoriteController,
  createFavoriteShareController,
  getSharedFavoritesController,
} from "../controllers/favoriteController.js";

const router = Router();

const requireAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (
    !authorization ||
    !authorization.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      error: {
        message: "Authentication required",
        status: 401,
      },
    });
  }

  const token = authorization.substring(7);

  try {
    // Verify token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
    );

    if (!payload.userId) {
      return res.status(401).json({
        error: {
          message: "Token does not contain user id",
          status: 401,
        },
      });
    }

    req.user = payload;

    next();
  } catch {
    return res.status(401).json({
      error: {
        message: "Invalid or expired token",
        status: 401,
      },
    });
  }
};

// All favorite endpoints require authentication.
router.get(
  "/favorites",
  requireAuth,
  getFavoritesController,
);

router.post(
  "/favorites",
  requireAuth,
  addFavoriteController,
);

router.delete(
  "/favorites/:mediaType/:tmdbId",
  requireAuth,
  deleteFavoriteController,
);

// Create a share link for the authenticated user's favorites.
router.post(
  "/favorites/share",
  requireAuth,
  createFavoriteShareController,
);

// Public endpoint for viewing a shared favorites list.
router.get(
  "/favorites/shared/:shareToken",
  getSharedFavoritesController,
);

export default router;