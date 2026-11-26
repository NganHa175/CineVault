// Middleware xác thực người dùng bằng JWT (tương đương middleware/auth.js bản tham khảo)
import type { NextFunction, Request, Response } from "express";
import { unauthorized } from "../utils/httpError";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthUser {
  userId: string;
  role: "USER" | "ADMIN";
}

// Alias tên thuận tiện cho các service dùng xuyên suốt
export type AccessUser = AuthUser;

// Mở rộng kiểu Request của Express để truy cập req.user ở mọi controller
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  return token.length > 0 ? token : null;
}

// Bắt buộc đăng nhập — không có token hợp lệ thì trả 401
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) return next(unauthorized());
  try {
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    next(unauthorized("Token hết hạn hoặc không hợp lệ"));
  }
}

// Tùy chọn: nếu có token hợp lệ thì gắn user, không thì cho đi như khách
// (dùng cho API công khai cần biết user có đang giữ quyền xem nào không)
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      req.user = { userId: payload.sub, role: payload.role };
    } catch {
      // token sai → xem như chưa đăng nhập, không chặn
    }
  }
  next();
}
