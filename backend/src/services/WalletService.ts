// WalletService — ví VND: số dư, lịch sử giao dịch, nạp tiền
// Nguyên tắc: chỉ THÊM bản ghi giao dịch, không sửa/xóa (append-only)
import type { WalletTransaction } from "@prisma/client";
import { prisma } from "../config/prisma";
import { notFound } from "../utils/httpError";

export interface WalletTxDTO {
  id: string;
  userId: string;
  type: "TOP_UP" | "MOVIE_UNLOCK" | "EPISODE_UNLOCK" | "SUBSCRIPTION_PAYMENT" | "ADMIN_ADJUSTMENT";
  status: "COMPLETED" | "FAILED" | "PENDING";
  amount: number; // dương = cộng ví, âm = trừ ví
  balanceBefore: number;
  balanceAfter: number;
  relatedContentId?: string | undefined;
  relatedContentType?: "MOVIE" | "EPISODE" | undefined;
  relatedContentTitle?: string | undefined;
  purchasedDurationHours?: number | undefined;
  reason?: string | undefined;
  createdAt: string;
}

// Chuyển bản ghi DB về đúng kiểu FE đang dùng (WalletTransaction trong types/index.ts)
export function mapTxDTO(t: WalletTransaction): WalletTxDTO {
  return {
    id: t.id,
    userId: t.userId,
    type: t.type,
    status: t.status,
    amount: t.amount,
    balanceBefore: t.balanceBefore,
    balanceAfter: t.balanceAfter,
    relatedContentId: t.movieId ?? t.episodeId ?? undefined,
    relatedContentType: t.movieId
      ? ("MOVIE" as const)
      : t.episodeId
        ? ("EPISODE" as const)
        : undefined,
    relatedContentTitle: t.contentTitle ?? undefined,
    purchasedDurationHours: t.durationHours ?? undefined,
    reason: t.reason ?? undefined,
    createdAt: t.createdAt.toISOString(),
  };
}

export const WalletService = {
  // GET /api/wallet — số dư + 5 giao dịch gần nhất
  async overview(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { walletBalance: true },
    });
    if (!user) throw notFound("Không tìm thấy người dùng");

    const recent = await prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return {
      balance: user.walletBalance,
      recentTransactions: recent.map(mapTxDTO),
    };
  },

  // GET /api/wallet/transactions?page&limit&type
  async listTransactions(
    userId: string,
    query: { page?: number | undefined; limit?: number | undefined; type?: string | undefined },
  ) {
    const page = Math.max(1, Math.trunc(query.page ?? 1));
    const limit = Math.min(100, Math.max(1, Math.trunc(query.limit ?? 10)));
    const where = {
      userId,
      ...(query.type ? { type: query.type as WalletTransaction["type"] } : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.walletTransaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.walletTransaction.count({ where }),
    ]);

    return {
      transactions: rows.map(mapTxDTO),
      pagination: { total, page, limit },
    };
  },

  // POST /api/wallet/topup { amount } — cổng thanh toán giả lập (demo)
  async topUp(userId: string, amount: number) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw notFound("Không tìm thấy người dùng");

      const balanceBefore = user.walletBalance;
      const balanceAfter = balanceBefore + amount;

      await tx.user.update({
        where: { id: userId },
        data: { walletBalance: balanceAfter },
      });

      const txRecord = await tx.walletTransaction.create({
        data: {
          userId,
          type: "TOP_UP",
          status: "COMPLETED",
          amount,
          balanceBefore,
          balanceAfter,
        },
      });

      return { balance: balanceAfter, transaction: mapTxDTO(txRecord) };
    });
  },
};
