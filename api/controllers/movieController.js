import { getAllMovies } from "../models/movieModel.js";

const getMovies = async (req, res, next) => {
  try {
    const result = await getAllMovies();
    res.status(200).json(result.rows || []);
  } catch (err) {
    next(err);
  }
};

export { getMovies };
