// PurchaseService — mua mở khóa phim/tập bằng ví
// Toàn bộ trong 1 transaction: kiểm tra nội dung → trừ ví → ghi giao dịch → cấp quyền xem
import { prisma } from "../config/prisma";
import { badRequest, conflict, notFound } from "../utils/httpError";
import { mapTxDTO } from "./WalletService";
import { resolveEpisodeAccess, resolveMovieAccess } from "../utils/price";

export interface UnlockResult {
  balance: number;
  pricePaid: number;
  contentTitle: string;
  durationHours: number;
  expiresAt: string;
  transaction: ReturnType<typeof mapTxDTO>;
}

export const PurchaseService = {
  // POST /api/purchases/unlock { contentType: "MOVIE" | "EPISODE", contentId }
  async unlock(userId: string, input: { contentType: "MOVIE" | "EPISODE"; contentId: string }): Promise<UnlockResult> {
    return prisma.$transaction(async (tx) => {
      // 1) Tải nội dung + tính giá/độ dài theo cấu hình hiện hành (server tự tính, không tin giá client gửi)
      let price: number;
      let durationHours: number;
      let contentTitle: string;
      let movieId: string | undefined;
      let episodeId: string | undefined;

      if (input.contentType === "MOVIE") {
        const movie = await tx.movie.findUnique({
          where: { id: input.contentId },
          include: { pricePreset: true },
        });
        if (!movie || movie.publicationStatus !== "PUBLISHED") {
          throw notFound("Không tìm thấy phim");
        }
        const access = resolveMovieAccess(movie);
        if (access.accessMode === "FREE") {
          throw badRequest("Nội dung này miễn phí — không cần mở khóa");
        }
        ({ resolvedPrice: price, unlockDurationHours: durationHours } = access);
        contentTitle = movie.title;
        movieId = movie.id;
      } else {
        const episode = await tx.episode.findUnique({
          where: { id: input.contentId },
          include: {
            pricePreset: true,
            season: { include: { defaultPricePreset: true } },
          },
        });
        if (!episode || episode.publicationStatus !== "PUBLISHED") {
          throw notFound("Không tìm thấy tập phim");
        }
        const access = resolveEpisodeAccess(episode, episode.season);
        if (access.accessMode === "FREE") {
          throw badRequest("Tập này miễn phí — không cần mở khóa");
        }
        ({ resolvedPrice: price, unlockDurationHours: durationHours } = access);
        contentTitle = episode.title;
        episodeId = episode.id;
      }

      // 2) Kiểm tra quyền còn hạn → chặn mua trùng
      const existing = await tx.contentAccess.findFirst({
        where: {
          userId,
          expiresAt: { gt: new Date() },
          ...(movieId ? { movieId } : {}),
          ...(episodeId ? { episodeId } : {}),
        },
      });
      if (existing) {
        throw conflict("Bạn vẫn còn quyền xem nội dung này (chưa hết hạn)");
      }

      // 3) Kiểm tra và trừ số dư
      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) throw notFound("Không tìm thấy người dùng");
      if (user.walletBalance < price) {
        throw badRequest(
          `Số dư ví không đủ (cần ${price.toLocaleString("vi-VN")} VND, đang có ${user.walletBalance.toLocaleString("vi-VN")} VND)`,
        );
      }
      const balanceBefore = user.walletBalance;
      const balanceAfter = balanceBefore - price;

      await tx.user.update({ where: { id: userId }, data: { walletBalance: balanceAfter } });

      // 4) Ghi giao dịch ví (append-only)
      const txRecord = await tx.walletTransaction.create({
        data: {
          userId,
          type: movieId ? "MOVIE_UNLOCK" : "EPISODE_UNLOCK",
          status: "COMPLETED",
          amount: -price,
          balanceBefore,
          balanceAfter,
          ...(movieId ? { movieId } : {}),
          ...(episodeId ? { episodeId } : {}),
          contentTitle,
          durationHours,
        },
      });

      // 5) Cấp quyền xem có thời hạn
      const expiresAt = new Date(Date.now() + durationHours * 3600 * 1000);
      await tx.contentAccess.create({
        data: {
          userId,
          ...(movieId ? { movieId } : {}),
          ...(episodeId ? { episodeId } : {}),
          purchasedAt: new Date(),
          expiresAt,
          pricePaid: price,
          durationHours,
        },
      });

      return {
        balance: balanceAfter,
        pricePaid: price,
        contentTitle,
        durationHours,
        expiresAt: expiresAt.toISOString(),
        transaction: mapTxDTO(txRecord),
      };
    });
  },

  // GET /api/purchases — thư viện: nội dung còn quyền xem
  async userLibrary(userId: string) {
    const accesses = await prisma.contentAccess.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
      orderBy: { purchasedAt: "desc" },
      include: {
        movie: { select: { id: true, title: true, posterUrl: true } },
        episode: {
          select: {
            id: true,
            title: true,
            episodeNumber: true,
            thumbnailUrl: true,
            season: { select: { series: { select: { id: true, title: true, posterUrl: true } } } },
          },
        },
      },
    });

    return {
      items: accesses.map((a) => {
        if (a.movie) {
          return {
            contentId: a.movie.id,
            contentType: "MOVIE" as const,
            title: a.movie.title,
            posterUrl: a.movie.posterUrl,
            expiresAt: a.expiresAt.toISOString(),
            pricePaid: a.pricePaid,
            durationHours: a.durationHours,
          };
        }
        const ep = a.episode!;
        return {
          contentId: ep.id,
          contentType: "EPISODE" as const,
          title: `${ep.season.series.title} — Tập ${ep.episodeNumber}: ${ep.title}`,
          posterUrl: ep.thumbnailUrl ?? ep.season.series.posterUrl,
          expiresAt: a.expiresAt.toISOString(),
          pricePaid: a.pricePaid,
          durationHours: a.durationHours,
        };
      }),
    };
  },
};
