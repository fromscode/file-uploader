import { NextFunction, Request, Response } from "express";
import NotFound404 from "../errors/NotFound404";

export default function (req: Request, res: Response, next: NextFunction) {
  next(new NotFound404());
}
