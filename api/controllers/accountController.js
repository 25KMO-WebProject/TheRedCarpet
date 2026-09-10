import { getAllAccounts } from "../models/accountModel.js";

const getAccounts = async (req, res, next) => {
  try {
    const result = await getAllAccounts();
    res.status(200).json(result.rows || []);
  } catch (err) {
    next(err);
  }
};

export { getAccounts };
