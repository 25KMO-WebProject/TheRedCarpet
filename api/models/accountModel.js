import { pool } from "./db.js";

const getAllAccounts = async () => {
  const result = await pool.query("SELECT * FROM account");
  return result;
};

const deleteAccount = async (id) => {
  const result = await pool.query(
    "DELETE FROM account WHERE id = $1", [id]);
    return result;
};

export { getAllAccounts, deleteAccount };
