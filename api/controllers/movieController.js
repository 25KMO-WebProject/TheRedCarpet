import {
  getAllMoviesModel,
  getMovieByTitleModel,
} from "../models/movieModel.js";

const getAllMoviesController = async (req, res, next) => {
  try {
    const result = await getAllMoviesModel();
    res.status(200).json(result || []);
  } catch (err) {
    next(err);
  }
};

const getMovieByTitleController = async (req, res, next) => {
  try {
    const result = await getMovieByTitleModel(req.params.title);
    res.status(200).json(result || []);
  } catch (err) {
    next(err);
  }
};

export { getAllMoviesController, getMovieByTitleController };
