import { getAllAccounts, deleteAccount } from "../models/accountModel.js";

const getAccounts = async (req, res, next) => {
  try {
    const result = await getAllAccounts();
    res.status(200).json(result.rows || []);
  } catch (err) {
    next(err);
  }
};

const removeAccount = async (req, res, next) => {
  try {
    const  id  = req.account.id
    const result = await deleteAccount(id)
    console.log(`Delete account with id: ${id}`)

    if (result.rowCount === 0) {
      const error = new Error("No account found")
      error.status = 404
    return next (error)
    }

    return res.status(200).json({id: Number(id)})
  } catch (err) {
    next(err)
    }
  }


export { getAccounts, removeAccount };
