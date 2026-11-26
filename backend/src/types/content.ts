// Kiểu dữ liệu dùng chung cho tầng nội dung (khớp frontend/src/types/index.ts)
// CastMember không phải model Prisma — cast trong DB được lưu dạng JSON
export interface CastMember {
  name: string;
  role: string;
  photoUrl?: string | undefined;
}
