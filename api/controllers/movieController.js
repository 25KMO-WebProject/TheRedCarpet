import { getAllMovies, getMovieByName } from "../models/movieModel.js";

const getMovies = async (req, res, next) => {
  try {
    const result = await getAllMovies();
    res.status(200).json(result || []);
  } catch (err) {
    next(err);
  }
};

const getMovieFromName = async (req, res, next) => {
  try {
    const result = await getMovieByName(req.params.name);
    res.status(200).json(result || []);
  } catch (err) {
    next(err);
  }
};

export { getMovies, getMovieFromName };
