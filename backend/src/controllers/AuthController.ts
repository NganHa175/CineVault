// AuthController — nhận request, validate, gọi service, trả response
// (Express 5 tự bắt lỗi async ném sang errorHandler nên không cần try/catch lặp)
import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { parse } from "../utils/validate";
import { loginSchema, registerSchema } from "../validators/auth.validator";

export const AuthController = {
  // POST /api/auth/register
  async register(req: Request, res: Response) {
    const data = parse(registerSchema, req.body);
    const user = await AuthService.register(data);
    res.status(201).json({ message: "Đăng ký thành công", user });
  },

  // POST /api/auth/login
  async login(req: Request, res: Response) {
    const data = parse(loginSchema, req.body);
    const result = await AuthService.login(data);
    res.json({ message: "Đăng nhập thành công", ...result });
  },

  // GET /api/auth/me (cần token)
  async me(req: Request, res: Response) {
    const user = await AuthService.me(req.user!.userId);
    res.json(user);
  },
};
