import { Router } from "express";
import { getAccounts, removeAccount } from "../controllers/accountController.js";

const router = Router();

router.get("/accounts", getAccounts);
router.delete('/accounts', removeAccount);

export default router;
