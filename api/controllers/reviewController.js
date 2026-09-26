import { getAllReviewsModel, createReviewModel } from "../models/reviewModel.js";

const getAllReviewsController = async (req, res, next) => {
    try {
        const movieId = Number(req.params.movieId);

        if (!Number.isInteger(movieId) || movieId <= 0) {
            const error = new Error("Invalid movie ID");
            error.status = 400;
            return next(error);
        }



        const reviews = await getAllReviewsModel(movieId);
        res.status(200).json(reviews);
    } catch (error) {
       return next(error);
    }
};

const createReviewController = async (req, res, next) => {
    try {
        const movieId = Number(req.body.movieId);
        const rating = Number(req.body.rating);
        const description = req.body.description;
        const accountId = req.user.userId;

        if (!Number.isInteger(movieId) || movieId <= 0) {
            const error = new Error("Invalid movie id");
            error.status = 400;
            return next(error);
        }

        if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
            const error = new Error("Rating must be between 1 and 5");
            error.status = 400;
            return next(error);
        }

        if (
            typeof description !== "string" ||
            description.trim().length === 0
        ) {
            const error = new Error("Text field cannot be empty");
            error.status = 400;
            return next(error);
        }

        if (description.length > 512) {
            const error = new Error("Maximum length is 512 characters");
            error.status = 400;
            return next(error);
        }

        const review = await createReviewModel(
            movieId,
            accountId,
            rating,
            description.trim(),
        );

        return res.status(201).json(review);
    } catch (error) {
        return next(error);
    }
    
};


   export {
    getAllReviewsController,
    createReviewController,
};