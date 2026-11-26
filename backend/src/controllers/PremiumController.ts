// PremiumController — gói Premium
import type { Request, Response } from "express";
import { PremiumService } from "../services/PremiumService";
import { parse } from "../utils/validate";
import { subscribeSchema } from "../validators/wallet.validator";

export const PremiumController = {
  // GET /api/premium/plans (công khai)
  async plans(_req: Request, res: Response) {
    res.json(await PremiumService.listPlans());
  },

  // POST /api/premium/subscribe (cần đăng nhập)
  async subscribe(req: Request, res: Response) {
    const { planId } = parse(subscribeSchema, req.body);
    const result = await PremiumService.subscribe(req.user!.userId, planId);
    res.status(201).json({ message: "Đăng ký Premium thành công", ...result });
  },

  // GET /api/premium/me
  async myStatus(req: Request, res: Response) {
    res.json(await PremiumService.myStatus(req.user!.userId));
  },
};
