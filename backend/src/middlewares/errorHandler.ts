// Bộ xử lý lỗi tập trung — đặt CUỐI app (tương tự error handler trong app.js bản tham khảo)
import type { ErrorRequestHandler } from "express";
import { HttpError } from "../utils/httpError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Lỗi Prisma quen thuộc → dịch sang mã HTTP đúng nghĩa
  // (nhận diện theo mã lỗi để không phụ thuộc cấu trúc nội bộ của @prisma/client)
  const prismaCode = (err as { code?: string }).code;
  if (prismaCode === "P2002") {
    return res.status(409).json({ message: "Dữ liệu bị trùng lặp (đã tồn tại trước đó)" });
  }
  if (prismaCode === "P2025") {
    return res.status(404).json({ message: "Không tìm thấy bản ghi trong cơ sở dữ liệu" });
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }

  // Lỗi lạ khác (bug) → log ra server để lập trình viên xem, client chỉ nhận thông báo chung
  console.error("❌ Unhandled error:", err);
  return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
};
