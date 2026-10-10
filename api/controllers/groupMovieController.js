import {
  getGroupMoviesModel,
  canAddGroupMovieModel,
  addGroupMovieModel,
} from "../models/groupMovieModel.js";


// Return the saved TMDB identifiers for group.
const getGroupMoviesController = async (
  req,
  res,
  next,
) => {
  try {
    const groupId = Number(req.params.id);

    if (!Number.isInteger(groupId) || groupId <= 0) {
      const error = new Error("Invalid group id");
      error.status = 400;
      return next(error);
    }

    const movies =
      await getGroupMoviesModel(groupId);

    return res.status(200).json(movies);
  } catch (error) {
    return next(error);
  }
};


// Add a TMDB movie or TV show to group.
const addGroupMovieController = async (
  req,
  res,
  next,
) => {
  try {
    const groupId = Number(req.params.id);
    const accountId = req.user.userId;

    const tmdbId = Number(req.body.tmdbId);
    const mediaType = req.body.mediaType;

    // Check that the group id is valid.
    if (!Number.isInteger(groupId) || groupId <= 0) {
      const error = new Error("Invalid group id");
      error.status = 400;
      return next(error);
    }

    // Check that the TMDB id is valid.
    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      const error = new Error("Invalid TMDB id");
      error.status = 400;
      return next(error);
    }

    // Check that the media type is valid.
    if (!["movie", "tv"].includes(mediaType)) {
      const error = new Error("Invalid media type");
      error.status = 400;
      return next(error);
    }

    // Only group member or owner may add movies.
    const allowed =
      await canAddGroupMovieModel(
        groupId,
        accountId,
      );

    if (!allowed) {
      const error = new Error(
        "Only group members can add movies",
      );
      error.status = 403;
      return next(error);
    }

    const movie = await addGroupMovieModel(
      groupId,
      tmdbId,
      mediaType,
    );

    // The same movie does not need to be added twice.
    if (!movie) {
      return res.status(200).json({
        message: "Already added to group",
        tmdbId,
        mediaType,
      });
    }

    return res.status(201).json(movie);
  } catch (error) {
    return next(error);
  }
};


export {
  getGroupMoviesController,
  addGroupMovieController,
};