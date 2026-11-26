// seedTypes.ts — kiểu dữ liệu cho các file seed
export interface CastSeed {
  name: string;
  role: string;
  photo?: string; // tên ảnh trong images.ts
}

export interface MovieSeed {
  id: string;
  title: string;
  overview: string;
  poster: string;
  backdrop?: string;
  genres: string[];
  releaseYear: number;
  runtimeMinutes: number;
  director: string;
  cast: CastSeed[];
  voteAverage: number;
  popularity: number;
  trailerId?: string;
  featured?: boolean;
  published?: boolean; // mặc định true
  mode: "FREE" | "LOCKED";
  preset?: 1 | 2;
  customPrice?: number;
  unlockHours?: number; // mặc định 48
}

export interface EpisodeSeed {
  id: string;
  no: number;
  title: string;
  overview: string;
  thumb?: string;
  minutes: number;
  published?: boolean;
  mode?: "FREE" | "LOCKED"; // chỉ có nghĩa khi setting = OVERRIDE
  preset?: 1 | 2;
  customPrice?: number;
  unlockHours?: number;
  setting?: "SEASON" | "OVERRIDE"; // mặc định SEASON
}

export interface SeasonSeed {
  id: string;
  no: number;
  title: string;
  mode: "FREE" | "LOCKED";
  preset?: 1 | 2;
  customPrice?: number;
  unlockHours?: number;
  published?: boolean;
  episodes: EpisodeSeed[];
}

export interface SeriesSeed {
  id: string;
  title: string;
  overview: string;
  poster: string;
  backdrop?: string;
  genres: string[];
  releaseYear: number;
  director: string;
  cast: CastSeed[];
  voteAverage: number;
  popularity: number;
  trailerId?: string;
  featured?: boolean;
  published?: boolean;
  mode: "FREE" | "LOCKED"; // cấu hình mặc định của series
  preset?: 1 | 2;
  customPrice?: number;
  unlockHours?: number;
  seasons: SeasonSeed[];
}
