// Một instance PrismaClient duy nhất dùng chung toàn app
// (tương tự config/db.js trong bản tham khảo, nhưng dùng Prisma thay Mongoose)
import { PrismaClient } from "@prisma/client";
import { env } from "./env";

export const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
});
