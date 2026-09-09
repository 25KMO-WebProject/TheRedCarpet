import { getAllAccounts, getAllMovies } from "../models/Test.js";

const getAccounts = async (req, res, next) => {
  try {
    const result = await getAllAccounts();
    res.status(200).json(result.rows || []);
  } catch (err) {
    next(err);
  }
};

const getMovies = async (req, res, next) => {
  try {
    const result = await getAllMovies();
    res.status(200).json(result.rows || []);
  } catch (err) {
    next(err);
  }
};

export { getAccounts, getMovies };

