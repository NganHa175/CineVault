import { Router } from "express";
import { MovieController } from "../controllers/MovieController";
import { optionalAuth } from "../middlewares/auth";

const router = Router();

router.get("/", optionalAuth, MovieController.list);
router.get("/:id", optionalAuth, MovieController.detail);

export default router;
