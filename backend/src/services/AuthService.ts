// AuthService — toàn bộ logic nghiệp vụ xác thực + shaping dữ liệu trả về FE
// (Định dạng User trả về KHỚP với frontend/src/types/index.ts)
import type { User as DbUser, UserRole } from "@prisma/client";
import { prisma } from "../config/prisma";
import { comparePassword, hashPassword } from "../utils/hash";
import { conflict, forbidden, notFound, unauthorized } from "../utils/httpError";
import { signAccessToken } from "../utils/jwt";

export interface PremiumInfo {
  status: "ACTIVE" | "EXPIRED" | "NONE";
  startDate?: string | undefined;
  expirationDate?: string | undefined;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string | undefined;
  role: UserRole;
  accountStatus: "ACTIVE" | "LOCKED";
  walletBalance: number;
  premium: PremiumInfo;
  createdAt: string;
}

// Trạng thái Premium KHÔNG lưu trên User — suy ra từ PremiumSubscription
// (có bản ghi chưa hết hạn → ACTIVE; có nhưng hết hạn → EXPIRED; chưa từng mua → NONE)
async function buildPremiumInfo(userId: string): Promise<PremiumInfo> {
  const latest = await prisma.premiumSubscription.findFirst({
    where: { userId },
    orderBy: { expirationDate: "desc" },
  });
  if (!latest) return { status: "NONE" };
  const status = latest.expirationDate > new Date() ? "ACTIVE" : "EXPIRED";
  return {
    status,
    startDate: latest.startDate.toISOString(),
    expirationDate: latest.expirationDate.toISOString(),
  };
}

export function toUserDTO(u: DbUser, premium: PremiumInfo): UserDTO {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatarUrl ?? undefined,
    role: u.role,
    accountStatus: u.accountStatus,
    walletBalance: u.walletBalance,
    premium,
    createdAt: u.createdAt.toISOString(),
  };
}

export const AuthService = {
  async register(input: { name: string; email: string; password: string }): Promise<UserDTO> {
    const existed = await prisma.user.findUnique({ where: { email: input.email } });
    if (existed) throw conflict("Email này đã được đăng ký");

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: await hashPassword(input.password),
      },
    });
    return toUserDTO(user, { status: "NONE" });
  },

  async login(input: { email: string; password: string }): Promise<{ accessToken: string; user: UserDTO }> {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw unauthorized("Email hoặc mật khẩu không đúng");

    const ok = await comparePassword(input.password, user.passwordHash);
    if (!ok) throw unauthorized("Email hoặc mật khẩu không đúng");

    if (user.accountStatus === "LOCKED") throw forbidden("Tài khoản đã bị khóa bởi quản trị viên");

    const premium = await buildPremiumInfo(user.id);

    return {
      accessToken: signAccessToken({ sub: user.id, role: user.role }),
      user: toUserDTO(user, premium),
    };
  },

  async me(userId: string): Promise<UserDTO> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw notFound("Không tìm thấy người dùng");
    const premium = await buildPremiumInfo(user.id);
    return toUserDTO(user, premium);
  },
};
