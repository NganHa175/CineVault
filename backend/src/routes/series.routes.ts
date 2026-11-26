import { Router } from "express";
import { SeriesController } from "../controllers/SeriesController";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.get("/", optionalAuth, SeriesController.list);
router.get("/:id", optionalAuth, SeriesController.detail);

export default router;
