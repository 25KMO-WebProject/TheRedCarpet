import { Router } from "express";
import jwt from "jsonwebtoken"
import {
    getAllGroupsController,
    getGroupFromIdController,
    getMembersFromGroupIdController,
    getCountofmembersController,
    createGroupController
} from "../controllers/groupController.js"

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


router.get("/groups", getAllGroupsController);
router.get("/groups/id/:id", getGroupFromIdController);
router.get("/groups/members/id/:id", getMembersFromGroupIdController)
router.get("/groups/:id/member-count", getCountofmembersController)
router.post("/groups", requireAuth, createGroupController);

export default router;