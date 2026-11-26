// Kiểm tra dữ liệu đầu vào bằng schema zod — sai format thì văng lỗi 400 ngay
import type { ZodType } from "zod";
import { badRequest } from "./httpError";

export function parse<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const first = result.error.issues[0];
    throw badRequest(first ? `${first.path.join(".")}: ${first.message}` : "Dữ liệu gửi lên không hợp lệ");
  }
  return result.data;
}
