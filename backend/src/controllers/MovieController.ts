// MovieController — دریافت request → gọi MovieService → trả response
import type { Request, Response } from "express";
import { MovieService } from "../services/MovieService";

export const MovieController = {
  // GET /api/movies
  async list(req: Request, res: Response) {
    const result = await MovieService.list({
      q: req.query.q?.toString(),
      genre: req.query.genre?.toString(),
      sort: req.query.sort?.toString(),
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      featured: req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined,
    });
    res.json(result);
  },

  // GET /api/movies/:id (optionalAuth — khách vẫn xem được, user biết thêm quyền của mình)
  async detail(req: Request, res: Response) {
    const result = await MovieService.detail(req.params.id as string, req.user);
    res.json(result);
  },
};
