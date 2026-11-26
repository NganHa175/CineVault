// Định nghĩa các đường dẫn API cho mua mở khóa nội dung
import { Router } from "express";
import { PurchaseController } from "../controllers/PurchaseController";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.post("/unlock", requireAuth, PurchaseController.unlock);
router.get("/", requireAuth, PurchaseController.library);

export default router;
