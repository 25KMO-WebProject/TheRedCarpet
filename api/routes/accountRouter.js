import { Router } from "express";
import {
  getAllAccountsController,
  getAccountFromIdController,
  deleteAccountController,
  loginController,
} from "../controllers/accountController.js";

const router = Router();

router.get("/accounts", getAllAccountsController);
router.get("/accounts/id/:id", getAccountFromIdController);
router.delete("/accounts", deleteAccountController);

router.post("/signin", loginController);

export default router;
