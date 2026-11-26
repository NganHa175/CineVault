// Điểm khởi động server (giống vai trò server.js trong bản tham khảo)
import { env } from "./config/env";
import { prisma } from "./config/prisma";
import { createApp } from "./app";

const app = createApp();

async function main() {
  // Kết nối database ngay khi khởi động để phát hiện lỗi sớm
  await prisma.$connect();

  app.listen(env.PORT, () => {
    console.log("✅ CineVault API đang chạy tại http://localhost:" + env.PORT);
    console.log("   Health check: http://localhost:" + env.PORT + "/health");
  });
}

main().catch((err) => {
  console.error("❌ Không khởi động được server:", err instanceof Error ? err.message : err);
  console.error("   → Kiểm tra database đã bật chưa (chạy: npx prisma dev ở thư mục backend)");
  process.exit(1);
});
