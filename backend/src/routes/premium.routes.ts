// Định nghĩa các đường dẫn API cho Premium
import { Router } from "express";
import { PremiumController } from "../controllers/PremiumController";
import { optionalAuth, requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/plans", optionalAuth, PremiumController.plans);
router.post("/subscribe", requireAuth, PremiumController.subscribe);
router.get("/me", requireAuth, PremiumController.myStatus);

export default router;
