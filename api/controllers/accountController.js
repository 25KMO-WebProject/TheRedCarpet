import jwt from "jsonwebtoken";
import { compare, hash } from "bcrypt";
import {
  getAllAccountsModel,
  getAccountFromIdModel,
  deleteAccountModel,
  loginModel,
} from "../models/accountModel.js";

const getAllAccountsController = async (req, res, next) => {
  try {
    const result = await getAllAccountsModel();
    res.status(200).json(result.rows || []);
  } catch (err) {
    next(err);
  }
};

const getAccountFromIdController = async (req, res, next) => {
  console.log("Searching account by id..");
  try {
    const result = await getAccountFromIdModel(req.params.id);
    res.status(200).json(result || []);
  } catch (err) {
    next(err);
  }
};

const deleteAccountController = async (req, res, next) => {
  try {
    const { id } = req.user; //Pittää muuttaa aukentoinin tullessa
    const result = await deleteAccountModel(id);
    console.log(`Delete account with id: ${id}`);
    const  id  = req.account.id
    const result = await deleteAccount(id)
    console.log(`Delete account with id: ${id}`)

    if (result.rowCount === 0) {
      const error = new Error("No account found");
      error.status = 404;
      return next(error);
    }

    return res.status(200).json({ id: Number(id) });
  } catch (err) {
    next(err);
  }
};

const loginController = async (req, res, next) => {
  console.log("User trying to log in..");
  console.log("Request body:", req.body);
  try {
    const account = req.body.account?.trim().toLowerCase();
    const password = req.body.password;

    if (!account || !password) {
      const error = new Error("Email/Username and password are required");
      error.status = 400;
      return next(error);
    }
    const result = await loginModel(account);
    const dbUser = result.rows[0];
    if (!dbUser || !(await compare(password, dbUser.password))) {
      const error = new Error("Invalid email/username or password");
      error.status = 401;
      return next(error);
    }
    const token = jwt.sign(
      { userId: dbUser.id, email: dbUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    return res.status(200).json({ id: dbUser.id, email: dbUser.email, token });
  } catch (error) {
    return next(error);
  }
};

export {
  getAllAccountsController,
  getAccountFromIdController,
  deleteAccountController,
  loginController,
};
