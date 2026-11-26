// PurchaseController — mua mở khóa nội dung + thư viện của tôi
import type { Request, Response } from "express";
import { PurchaseService } from "../services/PurchaseService";
import { parse } from "../utils/validate";
import { unlockSchema } from "../validators/wallet.validator";

export const PurchaseController = {
  // POST /api/purchases/unlock
  async unlock(req: Request, res: Response) {
    const data = parse(unlockSchema, req.body);
    const result = await PurchaseService.unlock(req.user!.userId, data);
    res.status(201).json({ message: "Mở khóa thành công", ...result });
  },

  // GET /api/purchases — nội dung đang có quyền xem
  async library(req: Request, res: Response) {
    res.json(await PurchaseService.userLibrary(req.user!.userId));
  },
};
