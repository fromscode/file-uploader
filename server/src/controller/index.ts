import type { Request, Response, NextFunction } from "express";

import validators from "../middlewares/validators.js";
import { matchedData, validationResult } from "express-validator";
import BadRequest400 from "../errors/BadRequest400.js";

const getLanding = [
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello World");
  },
];

const login = [
  validators.validateUsername,
  validators.validatePassword,
  async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      next(new BadRequest400(result.array()));
      return;
    }

    const { username, password } = matchedData(req);

    // TO-DO link with db

    res.sendStatus(200);
  },
];

const register = [
  validators.validateUsername,
  validators.validateEmail,
  validators.validatePassword,
  validators.validateConfirmPassword,
  async (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      next(new BadRequest400(result.array()));
      return;
    }

    const { username, password, email } = matchedData(req);

    // Implement hashing

    // TO-DO link with db

    res.sendStatus(201);
  },
];

export default {
  getLanding,
  login,
  register,
};
