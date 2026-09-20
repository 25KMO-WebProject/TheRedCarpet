import { pool } from "./db.js";

const getAllAccountsModel = async () => {
  const result = await pool.query("SELECT * FROM account");
  return result;
};

const getAccountFromIdModel = async (id) => {
  const result = await pool.query("SELECT * FROM account WHERE id = $1", [id]);
  return result.rows;
};

const deleteAccountModel = async (id) => {
  const result = await pool.query("DELETE FROM account WHERE id = $1", [id]);
  return result;
};

const loginModel = async (account, password) => {
  // Search with email
  let result = await pool.query(
    "SELECT id, email, password FROM account WHERE email = $1",
    [account],
  );

  // If not found with email, try with username
  if (result.rowCount === 0) {
    console.log("Row count 0!");
    result = await pool.query(
      "SELECT id, email, password FROM account WHERE username = $1",
      [account],
    );
  }

  return result;
};

export {
  getAllAccountsModel,
  deleteAccountModel,
  getAccountFromIdModel,
  loginModel,
};
