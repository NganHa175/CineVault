# 🎬 CineVault — Hướng dẫn chạy dự án

> Tài liệu dành cho thành viên đồ án. Cập nhật: sau Giai đoạn 1 (đưa UI gốc vào dự án).

## 1. Dự án gồm những gì?

| Thư mục | Vai trò | Công nghệ |
|---|---|---|
| `frontend/` | Giao diện website (UI gốc giữ nguyên 100%) | React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + React Router 7 + Radix UI/shadcn |
| `backend/` | API server + kết nối database | Express 5 + TypeScript + Prisma ORM + PostgreSQL *(đang xây dựng)* |
| `docs/` | Tài liệu + bản sao nguồn UI gốc (`figmaCinevault.txt`) + công cụ hỗ trợ | — |

## 2. Chuẩn bị (chỉ làm 1 lần)

- Cài **Node.js 22 trở lên** (máy dự án đang dùng v24 — OK).
- Mở **Command Prompt** (gõ `cmd` trong Start menu) thay cho PowerShell nếu PowerShell báo lỗi chạy script.
  - Lỗi điển hình: `npm.ps1 cannot be loaded because running scripts is disabled`.
  - Cách khắc phục trong PowerShell (chỉ làm 1 lần): mở PowerShell với quyền **Run as Administrator**, gõ:
    `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

## 3. Chạy giao diện (Frontend)

```cmd
cd frontend
npm install        (chỉ lần đầu, hoặc khi thêm thư viện mới)
npm run dev
```

Mở trình duyệt tại: **http://localhost:5173**

### Thử nhanh các vai người dùng
Góc trái-dưới màn hình có nút **`Dev: ...`** — bấm để đổi vai: `Guest → User → Premium → Admin`.
Each vai sẽ hiện/ẩn các trang kể cả trang quản trị `/admin`.

### Các trang nên thử (kiểm thử nội bộ)
| Trang | Đường dẫn |
|---|---|
| Trang chủ (hero poster + FAQ) | `/` |
| Danh sách phim | `/movies` |
| Danh sách series | `/series` |
| Tìm kiếm | `/search` |
| Chi tiết phim | `/movie/1` |
| Xem phim | `/watch/movie/1` |
| Ví / Nạp tiền | `/wallet` |
| Gói Premium | `/subscription` |
| Yêu thích / Lịch sử / Hồ sơ | `/favorites`, `/history`, `/profile` |
| Quản trị | `/admin` (Dashboard, Content, Pricing, Users, Transactions) |

> **Lưu ý:** Hiện UI đang chạy bằng **dữ liệu giả (mock)** — đúng như bản thiết kế gốc.
> Sau Giai đoạn 4, dữ liệu sẽ được thay bằng API/backend thật (giao diện không đổi).

## 4. Backend & Database *(sẽ có sau — đang xây dựng)*

- `cd backend && npm install`
- Khởi động database cục bộ, chạy `npm run dev` — chi tiết sẽ bổ sung.

## 5. Sự cố thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| `npm` báo lỗi chạy script trong PowerShell | Dùng `npm.cmd ...` hoặc xem mục 2 |
| Trang trắng sau khi `npm run dev` | Xem tab Console của trình duyệt (F12), báo lại lỗi cho dev |
| Đổi vai `Dev` nhưng giao diện không đổi | Bấm lại nút Dev, hoặc Ctrl+F5 tải lại trang |
