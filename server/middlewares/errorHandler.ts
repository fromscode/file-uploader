import { NextFunction, Request, Response } from "express";
import { HTTPError } from "../types";

export default function (
  err: HTTPError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.sendStatus(err.status || 500);
}
