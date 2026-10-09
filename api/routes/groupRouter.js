import { Router } from "express";
import jwt from "jsonwebtoken";

import {
  getAllGroupsController,
  getGroupFromIdController,
  getMembersFromGroupIdController,
  getCountofmembersController,
  getAllJoinRequestsController,
  createGroupController,
  deleteGroupController,
  createJoinRequestController,
} from "../controllers/groupController.js";

import {
  getGroupMoviesController,
  addGroupMovieController,
} from "../controllers/groupMovieController.js";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth); // Below this line, every single route requires auth!

router.get("/groups", getAllGroupsController);
router.get("/groups/id/:id", getGroupFromIdController);
router.get("/groups/members/id/:id", getMembersFromGroupIdController);
router.get("/groups/:id/member-count", getCountofmembersController);
router.get("/join-requests", getAllJoinRequestsController);

// Group movies
router.get("/groups/:id/movies", getGroupMoviesController);
router.post("/groups/:id/movies", addGroupMovieController);

router.post("/groups", createGroupController);
router.post("/groups/:id/join-requests", createJoinRequestController);
router.delete("/groups/id/:id", deleteGroupController);

export default router;