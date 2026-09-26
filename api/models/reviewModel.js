import { pool } from "./db.js";

const getAllReviewsModel = async (movieId) => {
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
        WHERE review.id_movie = $1
        ORDER BY review.date DESC
        `,
        [movieId],
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

export { getAllReviewsModel, createReviewModel }; 