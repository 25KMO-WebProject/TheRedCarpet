import { pool } from "./db.js";

// Fetch all TMDB favorites for a given account
const getFavoritesModel = async (accountId) => {
  const result = await pool.query(
    `
      SELECT
        tmdb_id,
        media_type,
        created_at
      FROM favourite_movies
      WHERE id_account = $1
      ORDER BY created_at DESC
    `,
    [accountId],
  );

  return result.rows;
};

// Store a TMDB movie or TV show as a favorite.
const addFavoriteModel = async (
  accountId,
  tmdbId,
  mediaType,
) => {
  const result = await pool.query(
    `
      INSERT INTO favourite_movies (
        id_account,
        tmdb_id,
        media_type
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (
        id_account,
        tmdb_id,
        media_type
      )
      DO NOTHING
      RETURNING
        id_account,
        tmdb_id,
        media_type,
        created_at
    `,
    [accountId, tmdbId, mediaType],
  );

  return result.rows[0] || null;
};

// Remove a favorite
const deleteFavoriteModel = async (
  accountId,
  tmdbId,
  mediaType,
) => {
  const result = await pool.query(
    `
      DELETE FROM favourite_movies
      WHERE id_account = $1
        AND tmdb_id = $2
        AND media_type = $3
      RETURNING tmdb_id, media_type
    `,
    [accountId, tmdbId, mediaType],
  );

  return result.rows[0] || null;
};

// Save a share token for the account
const saveShareTokenModel = async (
  accountId,
  shareToken,
) => {
  const result = await pool.query(
    `
      UPDATE account
      SET favorites_share_token = $1
      WHERE id = $2
      RETURNING favorites_share_token
    `,
    [shareToken, accountId],
  );

  return result.rows[0];
};

// Fetch shared favorites using a share token
const getSharedFavoritesModel = async (
  shareToken,
) => {
  const result = await pool.query(
    `
      SELECT
        fm.tmdb_id,
        fm.media_type,
        fm.created_at,
        a.username
      FROM favourite_movies fm
      JOIN account a
        ON a.id = fm.id_account
      WHERE a.favorites_share_token = $1
      ORDER BY fm.created_at DESC
    `,
    [shareToken],
  );

  return result.rows;
};

export {
  getFavoritesModel,
  addFavoriteModel,
  deleteFavoriteModel,
  saveShareTokenModel,
  getSharedFavoritesModel,
};