// Lỗi có kèm mã HTTP: ném ở đâu cũng được, errorHandler sẽ bắt và trả về client
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export const badRequest = (message: string) => new HttpError(400, message);

export const unauthorized = (message = "Chưa đăng nhập hoặc token không hợp lệ") =>
  new HttpError(401, message);

export const forbidden = (message = "Bạn không có quyền thực hiện thao tác này") =>
  new HttpError(403, message);

export const notFound = (message = "Không tìm thấy dữ liệu") => new HttpError(404, message);

export const conflict = (message: string) => new HttpError(409, message);
