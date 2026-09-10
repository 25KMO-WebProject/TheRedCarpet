import { pool } from "./db.js";

const getAllAccounts = async () => {
  const result = await pool.query("SELECT * FROM account");
  return result;
};

const getAllMovies = async () => {
  const result = await pool.query("SELECT * FROM movie");
  return result;
};

export { getAllAccounts, getAllMovies };
