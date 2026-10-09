import { pool } from "./db.js";


// Fetch all saved TMDB movies for a group.
const getGroupMoviesModel = async (groupId) => {
  const result = await pool.query(
    `
      SELECT
        tmdb_id,
        media_type,
        created_at
      FROM group_movies
      WHERE id_group = $1
      ORDER BY created_at DESC
    `,
    [groupId],
  );

  return result.rows;
};


// Check that the user is a member or owner of the group.
const canAddGroupMovieModel = async (
  groupId,
  accountId,
) => {
  const result = await pool.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM "group" g
        WHERE g.id = $1
          AND (
            g.id_owner = $2
            OR EXISTS (
              SELECT 1
              FROM member_list ml
              WHERE ml.id_group = g.id
                AND ml.id_account = $2
            )
          )
      ) AS allowed
    `,
    [groupId, accountId],
  );

  return result.rows[0].allowed;
};


// Store a TMDB movie or TV show for the group.
const addGroupMovieModel = async (
  groupId,
  tmdbId,
  mediaType,
) => {
  const result = await pool.query(
    `
      INSERT INTO group_movies (
        id_group,
        tmdb_id,
        media_type
      )
      VALUES ($1, $2, $3)
      ON CONFLICT (
        id_group,
        tmdb_id,
        media_type
      )
      DO NOTHING
      RETURNING
        id_group,
        tmdb_id,
        media_type,
        created_at
    `,
    [groupId, tmdbId, mediaType],
  );

  return result.rows[0] || null;
};


export {
  getGroupMoviesModel,
  canAddGroupMovieModel,
  addGroupMovieModel,
};