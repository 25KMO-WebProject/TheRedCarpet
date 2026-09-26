import { Router } from "express";
import jwt from "jsonwebtoken";

import {
    getAllReviewsController,
    createReviewController,
} from "../controllers/reviewController.js";

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

router.get(
    "/reviews/:movieId",
    getAllReviewsController,
);

router.post(
    "/reviews",
    requireAuth,
    createReviewController,
);

export default router;