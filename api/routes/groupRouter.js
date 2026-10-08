import { Router } from "express";
import {
  getAllGroupsController,
  getGroupFromIdController,
  getMembersFromGroupIdController,
  getCountofmembersController,
  getAllJoinRequestsController,
  getGroupJoinRequestsController,
  createGroupController,
  deleteGroupController,
  leaveGroupController,
  removeMemberFromGroupController,
  createJoinRequestController,
  approveJoinRequestController,
  rejectJoinRequestController,

} from "../controllers/groupController.js";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth); // Below this line, every single route requires auth!

router.get("/groups", getAllGroupsController);
router.get("/groups/id/:id", getGroupFromIdController);
router.get("/groups/members/id/:id", getMembersFromGroupIdController);
router.get("/groups/:id/member-count", getCountofmembersController);
router.get("/join-requests", getAllJoinRequestsController);
router.get("/groups/:id/join-requests", getGroupJoinRequestsController);
router.post("/groups", createGroupController);
router.post("/groups/:id/join-requests", createJoinRequestController);
router.delete("/groups/id/:idgroup", deleteGroupController);
router.delete("/groups/:idgroup/leave", leaveGroupController);
router.delete("/groups/:idgroup/members/:idaccount/remove", removeMemberFromGroupController);
router.patch("/groups/:idgroup/join-requests/:idaccount/approve", approveJoinRequestController);
router.patch("/groups/:idgroup/join-requests/:idaccount/reject", rejectJoinRequestController);


export default router;
