import type { Request, Response, NextFunction } from "express";

import bcrypt from "bcrypt";
import { prisma } from "../config/db/prisma.js";

import validators from "../middlewares/validators.js";
import { matchedData, validationResult } from "express-validator";
import BadRequest400 from "../errors/BadRequest400.js";
import passport from "passport";

const getLanding = [
  async (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello World");
  },
];

const login = [
  validators.validateUsername,
  (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) next(new BadRequest400(result.array()));
    else next();
  },
  passport.authenticate("local"),
  (req: Request, res: Response, next: NextFunction) => {
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      res.sendStatus(409);
      return;
    }

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        folders: {
          create: [
            {
              name: "Home",
            },
          ],
        },
      },
    });

    res.sendStatus(201);
  },
];

export default {
  getLanding,
  login,
  register,
};
