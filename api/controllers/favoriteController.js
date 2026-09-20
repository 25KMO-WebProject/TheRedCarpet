import {
  getFavoritesModel,
  addFavoriteModel,
  deleteFavoriteModel,
} from "../models/favoriteModel.js";

// User id comes from the verified JWT token
const getFavoritesController = async (
  req,
  res,
  next,
) => {
  try {
    const accountId = req.user.userId;

    const favorites =
      await getFavoritesModel(accountId);

    return res.status(200).json(favorites);
  } catch (error) {
    return next(error);
  }
};

// Add a TMDB movie or TV show to the authenticated user's favorites
const addFavoriteController = async (
  req,
  res,
  next,
) => {
  try {
    const accountId = req.user.userId;

    const tmdbId = Number(req.body.tmdbId);
    const mediaType = req.body.mediaType;

    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      const error = new Error("Invalid TMDB id");
      error.status = 400;
      return next(error);
    }

    if (!["movie", "tv"].includes(mediaType)) {
      const error = new Error("Invalid media type");
      error.status = 400;
      return next(error);
    }

    const favorite = await addFavoriteModel(
      accountId,
      tmdbId,
      mediaType,
    );

    if (!favorite) {
      return res.status(200).json({
        message: "Already in favorites",
        tmdbId,
        mediaType,
      });
    }

    return res.status(201).json(favorite);
  } catch (error) {
    return next(error);
  }
};

// Remove a favorite only from the currently authenticated user's list.
const deleteFavoriteController = async (
  req,
  res,
  next,
) => {
  try {
    const accountId = req.user.userId;

    const tmdbId = Number(req.params.tmdbId);
    const mediaType = req.params.mediaType;

    if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
      const error = new Error("Invalid TMDB id");
      error.status = 400;
      return next(error);
    }

    if (!["movie", "tv"].includes(mediaType)) {
      const error = new Error("Invalid media type");
      error.status = 400;
      return next(error);
    }

    const deletedFavorite =
      await deleteFavoriteModel(
        accountId,
        tmdbId,
        mediaType,
      );

    if (!deletedFavorite) {
      const error = new Error(
        "Favorite not found",
      );
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({
      message: "Favorite removed",
      ...deletedFavorite,
    });
  } catch (error) {
    return next(error);
  }
};

export {
  getFavoritesController,
  addFavoriteController,
  deleteFavoriteController,
};