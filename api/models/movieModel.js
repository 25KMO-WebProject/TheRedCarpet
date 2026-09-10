import { pool } from "./db.js";

const getAllMovies = async () => {
  const result = await pool.query("SELECT * FROM movie");
  return result.rows;
};

const getMovieByName = async (input) => {
  console.log("Searching for:", JSON.stringify(input));
  const result = await pool.query("SELECT * FROM movie WHERE title ILIKE $1", [
    `%${input}%`,
  ]);
  return result.rows;
};

export { getAllMovies, getMovieByName };
