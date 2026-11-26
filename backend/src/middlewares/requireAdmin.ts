// Chặn mọi request không phải ADMIN (tương đương checkPermission.js bản tham khảo)
// Luôn đặt SAU middleware requireAuth
import type { NextFunction, Request, Response } from "express";
import { forbidden } from "../utils/httpError";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return next(forbidden("Yêu cầu quyền quản trị (ADMIN)"));
  }
  next();
}
