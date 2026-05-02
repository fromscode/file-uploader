import type { NextFunction, Request, Response } from "express";
import NotFound404 from "../errors/NotFound404.js";

export default function (req: Request, res: Response, next: NextFunction) {
  next(new NotFound404());
}
