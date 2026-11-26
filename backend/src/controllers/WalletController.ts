// WalletController — ví của tôi
import type { Request, Response } from "express";
import { WalletService } from "../services/WalletService";
import { parse } from "../utils/validate";
import { topUpSchema } from "../validators/wallet.validator";

export const WalletController = {
  // GET /api/wallet
  async overview(req: Request, res: Response) {
    res.json(await WalletService.overview(req.user!.userId));
  },

  // GET /api/wallet/transactions
  async transactions(req: Request, res: Response) {
    res.json(
      await WalletService.listTransactions(req.user!.userId, {
        page: req.query.page ? Number(req.query.page) : undefined,
        limit: req.query.limit ? Number(req.query.limit) : undefined,
        type: req.query.type?.toString(),
      }),
    );
  },

  // POST /api/wallet/topup
  async topUp(req: Request, res: Response) {
    const { amount } = parse(topUpSchema, req.body);
    const result = await WalletService.topUp(req.user!.userId, amount);
    res.status(201).json({ message: "Nạp tiền thành công", ...result });
  },
};
