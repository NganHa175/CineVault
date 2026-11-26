// SeriesController
import type { Request, Response } from "express";
import { SeriesService } from "../services/SeriesService";

export const SeriesController = {
  async list(req: Request, res: Response) {
    const result = await SeriesService.list({
      q: req.query.q?.toString(),
      genre: req.query.genre?.toString(),
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    res.json(result);
  },

  async detail(req: Request, res: Response) {
    const result = await SeriesService.detail(req.params.id as string, req.user);
    res.json(result);
  },
};
