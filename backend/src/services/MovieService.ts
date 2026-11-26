// MovieService — danh mục phim công khai + mapping về đúng kiểu FE đang dùng
import type { Prisma } from "@prisma/client";
import type { CastMember } from "../types/content";
import type { AccessUser } from "../middlewares/auth";
import { prisma } from "../config/prisma";
import { AccessService } from "./AccessService";
import { notFound } from "../utils/httpError";
import { resolveMovieAccess } from "../utils/price";

export interface MovieDTO {
  id: string;
  title: string;
  originalTitle?: string | undefined;
  overview: string;
  posterUrl: string;
  backdropUrl?: string | undefined;
  genres: string[];
  releaseYear: number;
  runtimeMinutes: number;
  director: string;
  cast: CastMember[];
  voteAverage: number;
  popularity: number;
  trailerYoutubeId?: string | undefined;
  playbackUrl?: string | undefined;
  publicationStatus: "PUBLISHED" | "HIDDEN";
  accessMode: "FREE" | "LOCKED";
  priceSource: "PRESET_1" | "PRESET_2" | "CUSTOM";
  customPrice?: number | undefined;
  resolvedPrice: number;
  unlockDurationHours: number;
  isFeatured?: boolean | undefined;
}

// Gán nhãn PRESET_1/PRESET_2 theo thứ tự giá tăng dần của các preset đang bật (tối đa 2)
async function getPresetSources(): Promise<Record<string, "PRESET_1" | "PRESET_2">> {
  const presets = await prisma.pricePreset.findMany({
    where: { isActive: true },
    orderBy: { amount: "asc" },
    take: 2,
  });
  const map: Record<string, "PRESET_1" | "PRESET_2"> = {};
  presets.forEach((p, index) => {
    map[p.id] = index === 0 ? "PRESET_1" : "PRESET_2";
  });
  return map;
}

function parseCast(value: unknown): CastMember[] {
  return Array.isArray(value) ? (value as CastMember[]) : [];
}

function mapMovie(
  m: Parameters<typeof resolveMovieAccess>[0],
  presetSources: Record<string, "PRESET_1" | "PRESET_2">,
): MovieDTO {
  const access = resolveMovieAccess(m);
  const priceSource: MovieDTO["priceSource"] =
    m.customPrice != null
      ? "CUSTOM"
      : m.pricePresetId != null
        ? (presetSources[m.pricePresetId] ?? "PRESET_1")
        : "CUSTOM";
  return {
    id: m.id,
    title: m.title,
    originalTitle: m.originalTitle ?? undefined,
    overview: m.overview,
    posterUrl: m.posterUrl,
    backdropUrl: m.backdropUrl ?? undefined,
    genres: m.genres,
    releaseYear: m.releaseYear,
    runtimeMinutes: m.runtimeMinutes,
    director: m.director,
    cast: parseCast(m.cast),
    voteAverage: m.voteAverage,
    popularity: m.popularity,
    trailerYoutubeId: m.trailerYoutubeId ?? undefined,
    playbackUrl: m.playbackUrl ?? undefined,
    publicationStatus: m.publicationStatus,
    accessMode: access.accessMode,
    priceSource,
    customPrice: m.customPrice ?? undefined,
    resolvedPrice: access.resolvedPrice,
    unlockDurationHours: access.unlockDurationHours,
    isFeatured: m.isFeatured,
  };
}

const SORT_OPTIONS = ["popularity", "voteAverage", "releaseYear", "title"] as const;
type SortKey = (typeof SORT_OPTIONS)[number];

// Xây orderBy an toàn kiểu (tránh key tính động làm type bị widen)
function orderByFor(key: SortKey): Prisma.MovieOrderByWithRelationInput {
  switch (key) {
    case "voteAverage":
      return { voteAverage: "desc" };
    case "releaseYear":
      return { releaseYear: "desc" };
    case "title":
      return { title: "desc" };
    default:
      return { popularity: "desc" };
  }
}

export const MovieService = {
  // GET /api/movies?q&genre&sort&page&limit&featured — chỉ phim PUBLISHED
  async list(query: {
    q?: string | undefined;
    genre?: string | undefined;
    sort?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    featured?: boolean | undefined;
  }) {
    const page = Math.max(1, Math.trunc(query.page ?? 1));
    const limit = Math.min(60, Math.max(1, Math.trunc(query.limit ?? 24)));
    const sortKey: SortKey = SORT_OPTIONS.find((s) => s === query.sort) ?? "popularity";

    const where = {
      publicationStatus: "PUBLISHED" as const,
      ...(query.featured !== undefined ? { isFeatured: query.featured } : {}),
      ...(query.genre ? { genres: { has: query.genre } } : {}),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q, mode: "insensitive" as const } },
              { originalTitle: { contains: query.q, mode: "insensitive" as const } },
              { director: { contains: query.q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    const [rows, total, presetSources] = await Promise.all([
      prisma.movie.findMany({
        where,
        include: { pricePreset: true },
        orderBy: [orderByFor(sortKey), { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.movie.count({ where }),
      getPresetSources(),
    ]);

    return {
      movies: rows.map((row) => mapMovie(row, presetSources)),
      pagination: { total, page, limit },
    };
  },

  // GET /api/movies/:id — chi tiết + quyền xem của người dùng hiện tại (nếu có)
  async detail(id: string, viewer?: AccessUser | undefined) {
    const movie = await prisma.movie.findUnique({
      where: { id },
      include: { pricePreset: true },
    });
    // Phim bị ẩn coi như không tồn tại với người dùng thường
    if (!movie || movie.publicationStatus !== "PUBLISHED") {
      throw notFound("Không tìm thấy phim");
    }
    const presetSources = await getPresetSources();
    const viewerInfo = await AccessService.viewerInfo(viewer, {
      accessMode: movie.accessMode,
      movieId: movie.id,
    });
    return { movie: mapMovie(movie, presetSources), viewer: viewerInfo };
  },
};
