// AccessService — tra cứu quyền xem nội dung của một người dùng
// (Premium còn hạn? Có ContentAccess còn hạn cho nội dung này?)
import { prisma } from "../config/prisma";

export interface ViewerContentRef {
  accessMode: "FREE" | "LOCKED";
  movieId?: string | undefined;
  episodeId?: string | undefined;
}

export interface ViewerInfo {
  isAuthenticated: boolean;
  hasPremium: boolean;
  accessExpiresAt?: string | undefined;
  canWatch: boolean;
}

export const AccessService = {
  async hasActivePremium(userId: string): Promise<boolean> {
    const count = await prisma.premiumSubscription.count({
      where: { userId, expirationDate: { gt: new Date() } },
    });
    return count > 0;
  },

  // Tìm quyền xem còn hạn cho movie hoặc episode
  async findActiveAccess(userId: string, ref: { movieId?: string | undefined; episodeId?: string | undefined }) {
    if (!ref.movieId && !ref.episodeId) return null;
    return prisma.contentAccess.findFirst({
      where: {
        userId,
        expiresAt: { gt: new Date() },
        ...(ref.movieId ? { movieId: ref.movieId } : {}),
        ...(ref.episodeId ? { episodeId: ref.episodeId } : {}),
      },
      orderBy: { expiresAt: "desc" },
    });
  },

  // Tổng hợp quyền xem cho một nội dung (đúng luật canWatch trong đặc tả FE)
  async viewerInfo(user: { userId: string } | undefined, content: ViewerContentRef): Promise<ViewerInfo> {
    if (content.accessMode === "FREE") {
      return { isAuthenticated: !!user, hasPremium: false, canWatch: true };
    }
    if (!user) {
      return { isAuthenticated: false, hasPremium: false, canWatch: false };
    }
    const [premium, access] = await Promise.all([
      this.hasActivePremium(user.userId),
      this.findActiveAccess(user.userId, content),
    ]);
    return {
      isAuthenticated: true,
      hasPremium: premium,
      accessExpiresAt: access?.expiresAt.toISOString(),
      canWatch: premium || !!access,
    };
  },
};
