import { Router } from "express";
import { getAccounts } from "../controllers/accountController.js";

const router = Router();

router.get("/accounts", getAccounts);

export default router;
