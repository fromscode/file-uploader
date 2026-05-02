import type { NextFunction, Request, Response } from "express";
import type { HTTPError } from "../../types.js";

export default function (
  err: HTTPError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (err.status && err.status == 400) {
    res.status(400).json({
      errors: err.errors!,
    });
  } else res.sendStatus(err.status || 500);
}
