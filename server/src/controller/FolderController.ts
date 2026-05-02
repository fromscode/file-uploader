import { NextFunction, Request, Response } from "express";

const folder = [
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("a list of folders");
  },
];

export default {
  folder,
};
