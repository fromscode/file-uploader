import { Request, Response, NextFunction } from "express";

const getLanding = [
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello World");
  },
];

export default {
  getLanding,
};
