// Định nghĩa các đường dẫn API cho ví
import { Router } from "express";
import { WalletController } from "../controllers/WalletController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, WalletController.overview);
router.get("/transactions", requireAuth, WalletController.transactions);
router.post("/topup", requireAuth, WalletController.topUp);

export default router;
