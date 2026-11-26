// Schema kiểm tra dữ liệu đăng ký / đăng nhập (zod)
import { z } from "zod";

// Dùng regex chủ động để không phụ thuộc phiên bản zod (v3 hay v4 đều chạy)
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email không hợp lệ");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Tên tối thiểu 2 ký tự").max(60, "Tối đa 60 ký tự"),
  email: emailField,
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự").max(72, "Mật khẩu tối đa 72 ký tự"),
});

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Thiếu mật khẩu"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
