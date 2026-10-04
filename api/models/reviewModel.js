import { pool } from "./db.js";

// Hakee movies taulusta id:n TMDB id:n perusteella.
// review taulussa oma tietokannan id ja frontend TMDB id.
const getMovieIdByTmdbIdModel = async (tmdbId) => {
    const result = await pool.query(
        `
        SELECT id
        FROM movie
        WHERE tmdb_id = $1
        `,
        [tmdbId],
    );

    return result.rows[0];
};

const getAllReviewsModel = async (tmdbId) => {
    const result = await pool.query(
        `

        SELECT
        review.rating,
        review.description,
        review.date,
        account.username
        FROM review
        JOIN account
        ON review.id_account = account.id
        JOIN movie
        ON review.id_movie = movie.id
        WHERE movie.tmdb_id = $1
        ORDER BY review.date DESC
        `,
        [tmdbId],
    );
    return result.rows;
}

const createReviewModel = async (movieId, accountId, rating, description) => {
    const result = await pool.query(
        `
        INSERT INTO review (id_movie, id_account, rating, description, date)
        VALUES ($1, $2, $3, $4, NOW())
        RETURNING id_movie, id_account, rating, description, date
        `,
        [movieId, accountId, rating, description],
    );
    return result.rows[0];
};

export {
    getMovieIdByTmdbIdModel,
    getAllReviewsModel,
    createReviewModel,
};