import { Router } from "express";
import { getMovies, getMovieFromName } from "../controllers/movieController.js";

const router = Router();

router.get("/movies", getMovies);
router.get("/movies/name/:name", getMovieFromName);

export default router;
