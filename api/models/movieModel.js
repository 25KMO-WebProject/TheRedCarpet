import { pool } from "./db.js";

const getAllMovies = async () => {
  const result = await pool.query("SELECT * FROM movie");
  return result;
};

export { getAllMovies };
