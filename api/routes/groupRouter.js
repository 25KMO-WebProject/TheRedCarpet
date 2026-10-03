import { Router } from "express";
import jwt from "jsonwebtoken"
import {
    getAllGroupsController,
    getGroupFromIdController,
    getMembersFromGroupIdController,
    getCountofmembersController,
    getAllJoinRequestsController,
    getGroupJoinRequestsController,
    createGroupController,
    deleteGroupController,
    createJoinRequestController,
    approveJoinRequestController,
    rejectJoinRequestController,
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


router.get("/groups", requireAuth, getAllGroupsController);
router.get("/groups/id/:id", getGroupFromIdController);
router.get("/groups/members/id/:id", getMembersFromGroupIdController)
router.get("/groups/:id/member-count", getCountofmembersController)
router.get("/join-requests", getAllJoinRequestsController)
router.get("/groups/:id/join-requests", requireAuth, getGroupJoinRequestsController)
router.post("/groups", requireAuth, createGroupController);
router.post("/groups/:id/join-requests", requireAuth, createJoinRequestController)
router.delete("/groups/id/:id", requireAuth, deleteGroupController)
router.patch("/groups/:idgroup/join-requests/:idaccount/approve", requireAuth, approveJoinRequestController)
router.patch("/groups/:idgroup/join-requests/:idaccount/reject", requireAuth, rejectJoinRequestController)

export default router;