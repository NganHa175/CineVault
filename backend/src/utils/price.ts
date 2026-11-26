// price.ts — Quy tắc tính giá & thời hạn mở khóa (đúng đặc tả schema.prisma):
//  - resolvedPrice KHÔNG lưu DB, tính tại chỗ: customPrice ?? pricePreset.amount
//  - Episode settingSource = SEASON thì kế thừa cấu hình Season
//  - accessMode = FREE thì giá = 0
import type { AccessMode, Episode, Movie, PricePreset, Season } from "@prisma/client";

export interface ResolvedAccess {
  accessMode: AccessMode;
  resolvedPrice: number; // VND
  unlockDurationHours: number;
}

type MovieWithPreset = Movie & { pricePreset: PricePreset | null };
type SeasonWithPreset = Season & { defaultPricePreset: PricePreset | null };

export function resolveMovieAccess(movie: MovieWithPreset): ResolvedAccess {
  if (movie.accessMode === "FREE") {
    return { accessMode: "FREE", resolvedPrice: 0, unlockDurationHours: movie.unlockDurationHours };
  }
  const price = movie.customPrice ?? movie.pricePreset?.amount ?? 0;
  return { accessMode: "LOCKED", resolvedPrice: price, unlockDurationHours: movie.unlockDurationHours };
}

export function resolveSeasonAccess(season: SeasonWithPreset): ResolvedAccess {
  if (season.defaultAccessMode === "FREE") {
    return { accessMode: "FREE", resolvedPrice: 0, unlockDurationHours: season.defaultUnlockDurationHours };
  }
  const price = season.defaultCustomPrice ?? season.defaultPricePreset?.amount ?? 0;
  return {
    accessMode: "LOCKED",
    resolvedPrice: price,
    unlockDurationHours: season.defaultUnlockDurationHours,
  };
}

// Episode: SEASON = dùng cấu hình season; OVERRIDE = dùng cấu hình riêng của tập
export function resolveEpisodeAccess(
  episode: Episode & { pricePreset: PricePreset | null },
  season: SeasonWithPreset,
): ResolvedAccess {
  if (episode.settingSource === "SEASON" || episode.accessMode === null) {
    return resolveSeasonAccess(season);
  }
  if (episode.accessMode === "FREE") {
    return {
      accessMode: "FREE",
      resolvedPrice: 0,
      unlockDurationHours: episode.unlockDurationHours ?? season.defaultUnlockDurationHours,
    };
  }
  const price = episode.customPrice ?? episode.pricePreset?.amount ?? 0;
  return {
    accessMode: "LOCKED",
    resolvedPrice: price,
    unlockDurationHours: episode.unlockDurationHours ?? season.defaultUnlockDurationHours,
  };
}
