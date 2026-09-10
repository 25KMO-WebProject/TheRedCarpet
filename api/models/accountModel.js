import { pool } from "./db.js";

const getAllAccounts = async () => {
  const result = await pool.query("SELECT * FROM account");
  return result;
};

export { getAllAccounts };
