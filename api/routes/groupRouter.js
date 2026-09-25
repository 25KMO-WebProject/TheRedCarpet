import { Router } from "express";
import {
    getAllGroupsController,
    getGroupFromIdController
} from "../controllers/groupController.js"

const router = Router();

router.get("/groups", getAllGroupsController);
router.get("/groups/id/:id", getGroupFromIdController);

export default router;