// Gốc /api — mỗi nghiệp vụ một file route, gắn vào đây
import { Router } from "express";
import authRoutes from "./auth.routes";
import moviesRoutes from "./movies.routes";
import seriesRoutes from "./series.routes";
import walletRoutes from "./wallet.routes";
import purchasesRoutes from "./purchases.routes";
import premiumRoutes from "./premium.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/movies", moviesRoutes);
apiRouter.use("/series", seriesRoutes);
apiRouter.use("/wallet", walletRoutes);
apiRouter.use("/purchases", purchasesRoutes);
apiRouter.use("/premium", premiumRoutes);

