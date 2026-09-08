import { pool } from "./db.js";

const getAllTests = async () => {
  const result = await pool.query("SELECT * FROM account");
  return result;
};

export { getAllTests };

