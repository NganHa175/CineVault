// seedImages.ts — đọc bảng ánh xạ ảnh từ code frontend (frontend/src/app/images.ts)
// để seed dùng ĐÚNG ẢNH bản mock (không cần copy file ảnh)
import fs from "node:fs";
import path from "node:path";

const FRONTEND_SRC = path.resolve(__dirname, "..", "..", "frontend", "src");

let cache: Record<string, string> | null = null;

function load() {
  const map: Record<string, string> = {};
  const content = fs.readFileSync(path.join(FRONTEND_SRC, "app", "images.ts"), "utf8");
  const re = /export\s*\{\s*default\s+as\s+([A-Za-z0-9_]+)\s*\}\s*from\s*"([^"]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    const name = m[1]!;
    const src = m[2]!;
    // "@/imports/X/hash.png" -> "/src/imports/X/hash.png" (URL chạy được trên dev server FE)
    map[name] = src.replace("@/", "/src/");
  }
  cache = map;
}

// name: "p00", "ms54", "kantaraHero", "cast0"... -> URL ảnh
export function img(name: string): string {
  if (!cache) load();
  const url = cache?.[name];
  if (!url) throw new Error(`Khong tim thay anh '${name}' trong frontend/src/app/images.ts`);
  return url;
}

