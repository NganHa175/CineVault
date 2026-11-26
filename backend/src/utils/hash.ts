// Mã hóa và so sánh mật khẩu (bcrypt)
import bcrypt from "bcryptjs";

export const hashPassword = (plain: string) => bcrypt.hash(plain, 10);

export const comparePassword = (plain: string, hashed: string) => bcrypt.compare(plain, hashed);
