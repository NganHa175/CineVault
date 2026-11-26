// Schema kiểm tra dữ liệu ví / mua mở khóa / mua gói Premium (zod)
// (Viết theo cú pháp chạy được trên cả zod v3 lẫn v4)
import { z } from "zod";

export const topUpSchema = z.object({
  amount: z
    .number()
    .int("Số tiền phải là số nguyên")
    .min(10_000, "Nạp tối thiểu 10.000 VND")
    .max(50_000_000, "Nạp tối đa 50.000.000 VND mỗi lần"),
});

export const unlockSchema = z.object({
  contentType: z.enum(["MOVIE", "EPISODE"]),
  contentId: z.string().min(1, "Thiếu contentId"),
});

export const subscribeSchema = z.object({
  planId: z.string().min(1, "Thiếu planId"),
});
