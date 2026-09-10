import { Router } from "express";
import { getAccounts, getMovies } from "../controllers/TestController.js";

const router = Router();

router.get("/accounts", getAccounts);
router.get("/movies", getMovies);

export default router;
