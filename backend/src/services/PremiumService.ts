// PremiumService — gói Premium: xem gói, mua gói bằng ví, trạng thái hiện tại
import { prisma } from "../config/prisma";
import { badRequest, notFound } from "../utils/httpError";
import { mapTxDTO } from "./WalletService";

export const PremiumService = {
  // GET /api/premium/plans — các gói đang bật
  async listPlans() {
    const plans = await prisma.premiumPlan.findMany({
      where: { isActive: true },
      orderBy: { durationDays: "asc" },
    });
    return {
      plans: plans.map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        durationDays: p.durationDays,
      })),
    };
  },

  // POST /api/premium/subscribe { planId } — mua/gia hạn gói bằng số dư ví
  async subscribe(userId: string, planId: string) {
    return prisma.$transaction(async (tx) => {
      const plan = await tx.premiumPlan.findUnique({ where: { id: planId } });
      if (!plan || !plan.isActive) throw notFound("Không tìm thấy gói Premium");

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw notFound("Không tìm thấy người dùng");
      if (user.walletBalance < plan.price) {
        throw badRequest(
          `Số dư ví không đủ (cần ${plan.price.toLocaleString("vi-VN")} VND, đang có ${user.walletBalance.toLocaleString("vi-VN")} VND)`,
        );
      }

      // Gia hạn: thời hạn mới tính từ thời điểm hiện tại (không cộng dồn ngày còn lại) — đơn giản, dễ giải thích khi bảo vệ
      const startDate = new Date();
      const expirationDate = new Date(
        startDate.getTime() + plan.durationDays * 24 * 3600 * 1000,
      );

      const balanceBefore = user.walletBalance;
      const balanceAfter = balanceBefore - plan.price;

      const subscription = await tx.premiumSubscription.create({
        data: {
          userId,
          planId,
          startDate,
          expirationDate,
          pricePaid: plan.price,
        },
      });

      await tx.user.update({ where: { id: userId }, data: { walletBalance: balanceAfter } });

      const txRecord = await tx.walletTransaction.create({
        data: {
          userId,
          type: "SUBSCRIPTION_PAYMENT",
          status: "COMPLETED",
          amount: -plan.price,
          balanceBefore,
          balanceAfter,
          subscriptionId: subscription.id,
          contentTitle: `Gói Premium: ${plan.name}`,
        },
      });

      return {
        balance: balanceAfter,
        subscription: {
          status: "ACTIVE" as const,
          startDate: subscription.startDate.toISOString(),
          expirationDate: subscription.expirationDate.toISOString(),
        },
        transaction: mapTxDTO(txRecord),
      };
    });
  },

  // GET /api/premium/me — trạng thái Premium hiện tại của tôi
  async myStatus(userId: string) {
    const latest = await prisma.premiumSubscription.findFirst({
      where: { userId },
      orderBy: { expirationDate: "desc" },
      include: { plan: { select: { name: true } } },
    });
    return {
      status: !latest
        ? ("NONE" as const)
        : latest.expirationDate > new Date()
          ? ("ACTIVE" as const)
          : ("EXPIRED" as const),
      planName: latest?.plan.name,
      startDate: latest?.startDate.toISOString(),
      expirationDate: latest?.expirationDate.toISOString(),
    };
  },
};
