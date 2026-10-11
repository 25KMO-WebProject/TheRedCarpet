import { Router } from "express";
import {
  getAllAccountsController,
  getAccountFromIdController,
  deleteAccountController,
  loginController,
  logoutController,
} from "../controllers/accountController.js";

const router = Router();

router.get("/accounts", getAllAccountsController);
router.get("/accounts/id/:id", getAccountFromIdController);
router.delete("/accounts/id/:id", deleteAccountController);

router.post("/login", loginController);
router.post("/logout", logoutController);

export default router;