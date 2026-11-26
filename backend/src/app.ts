// app.ts —装配 Express: middleware toàn cục + routes + xử lý lỗi
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
  app.use(express.json({ limit: "2mb" }));

  // Kiểm tra sức khỏe — dùng để biết server sống chưa
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "CineVault API" });
  });

  app.use("/api", apiRouter);

  // Bộ xử lý lỗi — luôn đứng cuối
  app.use(errorHandler);

  return app;
}
