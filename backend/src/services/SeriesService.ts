// SeriesService — danh mục series > season > episode, tính giá kế thừa đúng đặc tả
import type { Episode, PricePreset, Season, Series } from "@prisma/client";
import type { CastMember } from "../types/content";
import type { AccessUser } from "../middlewares/auth";
import { prisma } from "../config/prisma";
import { AccessService } from "./AccessService";
import { notFound } from "../utils/httpError";
import { resolveEpisodeAccess } from "../utils/price";

type EpisodeWithPreset = Episode & { pricePreset: PricePreset | null };
type SeasonWithPreset = Season & { defaultPricePreset: PricePreset | null; episodes: EpisodeWithPreset[] };
type SeriesWithSeasons = Series & { seasons: SeasonWithPreset[] };

export interface EpisodeDTO {
  id: string;
  seriesId: string;
  seasonId: string;
  episodeNumber: number;
  title: string;
  overview: string;
  thumbnailUrl?: string | undefined;
  durationMinutes: number;
  publicationStatus: "PUBLISHED" | "HIDDEN";
  accessMode: "FREE" | "LOCKED";
  resolvedPrice: number;
  unlockDurationHours: number;
  settingSource: "SEASON" | "OVERRIDE";
}

export interface SeasonDTO {
  id: string;
  seriesId: string;
  seasonNumber: number;
  title: string;
  overview?: string | undefined;
  airDate?: string | undefined;
  publicationStatus: "PUBLISHED" | "HIDDEN";
  episodes: EpisodeDTO[];
}

export interface SeriesDTO {
  id: string;
  title: string;
  originalTitle?: string | undefined;
  overview: string;
  posterUrl: string;
  backdropUrl?: string | undefined;
  genres: string[];
  releaseYear: number;
  director: string;
  cast: CastMember[];
  voteAverage: number;
  popularity: number;
  trailerYoutubeId?: string | undefined;
  publicationStatus: "PUBLISHED" | "HIDDEN";
  seasons: SeasonDTO[];
  isFeatured?: boolean | undefined;
}

function mapEpisode(season: SeasonWithPreset, ep: EpisodeWithPreset): EpisodeDTO {
  const access = resolveEpisodeAccess(ep, season);
  return {
    id: ep.id,
    seriesId: season.seriesId,
    seasonId: ep.seasonId,
    episodeNumber: ep.episodeNumber,
    title: ep.title,
    overview: ep.overview,
    thumbnailUrl: ep.thumbnailUrl ?? undefined,
    durationMinutes: ep.durationMinutes,
    publicationStatus: ep.publicationStatus,
    accessMode: access.accessMode,
    resolvedPrice: access.resolvedPrice,
    unlockDurationHours: access.unlockDurationHours,
    settingSource: ep.settingSource,
  };
}

function mapSeason(season: SeasonWithPreset): SeasonDTO {
  // resolveSeasonAccess dùng đểdish logic kế thừa, không trả trực tiếp
  return {
    id: season.id,
    seriesId: season.seriesId,
    seasonNumber: season.seasonNumber,
    title: season.title,
    overview: season.overview ?? undefined,
    airDate: season.airDate?.toISOString(),
    publicationStatus: season.publicationStatus,
    episodes: season.episodes
      .filter((ep) => ep.publicationStatus === "PUBLISHED")
      .sort((a, b) => a.episodeNumber - b.episodeNumber)
      .map((ep) => mapEpisode(season, ep)),
  };
}

function mapSeries(s: SeriesWithSeasons): SeriesDTO {
  return {
    id: s.id,
    title: s.title,
    originalTitle: s.originalTitle ?? undefined,
    overview: s.overview,
    posterUrl: s.posterUrl,
    backdropUrl: s.backdropUrl ?? undefined,
    genres: s.genres,
    releaseYear: s.releaseYear,
    director: s.director,
    cast: Array.isArray(s.cast) ? (s.cast as unknown as CastMember[]) : [],
    voteAverage: s.voteAverage,
    popularity: s.popularity,
    trailerYoutubeId: s.trailerYoutubeId ?? undefined,
    publicationStatus: s.publicationStatus,
    seasons: s.seasons
      .filter((sn) => sn.publicationStatus === "PUBLISHED")
      .sort((a, b) => a.seasonNumber - b.seasonNumber)
      .map(mapSeason),
  };
}

export const SeriesService = {
  async list(query: { q?: string | undefined; genre?: string | undefined; page?: number | undefined; limit?: number | undefined }) {
    const page = Math.max(1, Math.trunc(query.page ?? 1));
    const limit = Math.min(60, Math.max(1, Math.trunc(query.limit ?? 24)));
    const where = {
      publicationStatus: "PUBLISHED" as const,
      ...(query.genre ? { genres: { has: query.genre } } : {}),
      ...(query.q
        ? { title: { contains: query.q, mode: "insensitive" as const } }
        : {}),
    };

    const [rows, total] = await Promise.all([
      prisma.series.findMany({
        where,
        orderBy: [{ popularity: "desc" }, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { seasons: true } } },
      }),
      prisma.series.count({ where }),
    ]);

    // Danh sách chỉ cần thông tin cơ bản + số mùa (không tải toàn bộ seasons/episodes)
    const items = rows.map((s) => {
      const { _count, ...rest } = s;
      return {
        ...mapSeries({ ...rest, seasons: [] }),
        seasonCount: _count.seasons,
      };
    });

    return { series: items, pagination: { total, page, limit } };
  },

  async detail(id: string, viewer?: AccessUser | undefined) {
    const series = await prisma.series.findUnique({
      where: { id },
      include: {
        seasons: {
          include: { defaultPricePreset: true, episodes: { include: { pricePreset: true } } },
        },
      },
    });
    if (!series || series.publicationStatus !== "PUBLISHED") {
      throw notFound("Không tìm thấy series");
    }
    const dto = mapSeries(series);

    // Quyền xem của từng tập (nếu có người dùng)
    const episodesAccess = await Promise.all(
      dto.seasons.flatMap((sn) =>
        sn.episodes.map(async (ep) => ({
          episodeId: ep.id,
          viewer: await AccessService.viewerInfo(viewer, {
            accessMode: ep.accessMode,
            episodeId: ep.id,
          }),
        })),
      ),
    );
    const accessMap = new Map(
      episodesAccess.map((item) => [item.episodeId, item.viewer]),
    );

    return {
      series: dto,
      viewerByEpisode: Object.fromEntries(accessMap),
    };
  },
};
