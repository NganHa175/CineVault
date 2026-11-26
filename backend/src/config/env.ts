// Đọc và kiểm tra biến môi trường — tập trung một chỗ duy nhất
import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Thiếu biến môi trường ${name} — hãy kiểm tra file .env`);
  }
  return value;
}

export const env = {
  DATABASE_URL: requireEnv("DATABASE_URL"),
  JWT_SECRET: process.env.JWT_SECRET ?? "cinevault-dev-secret",
  PORT: Number(process.env.PORT ?? 3000),
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV ?? "development",
};
