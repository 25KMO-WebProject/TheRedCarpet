import { Router } from "express";
import {
    getAllGroupsController,
    getGroupFromIdController,
    getMembersFromGroupIdController,
    getCountofmembersController
} from "../controllers/groupController.js"

const router = Router();

router.get("/groups", getAllGroupsController);
router.get("/groups/id/:id", getGroupFromIdController);
router.get("/groups/members/id/:id", getMembersFromGroupIdController)
router.get("/groups/:id/member-count", getCountofmembersController)

export default router;