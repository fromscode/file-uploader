import type { Request, Response, NextFunction } from "express";

import bcrypt from "bcrypt";
import { prisma } from "../config/db/prisma.js";

import validators from "../middlewares/validators.js";
import { matchedData, validationResult } from "express-validator";
import BadRequest400 from "../errors/BadRequest400.js";
import passport, { use } from "passport";

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

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      const fields = [];
      if (existingUser.email === email) fields.push("email");
      if (existingUser.username === username) fields.push("username");

      return res.status(409).json({
        fields,
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPass,
        folders: {
          create: [
            {
              name: "Home",
            },
          ],
        },
      },
    });

    req.login(user, (err) => {
      if (err) return next(err);

      return res.sendStatus(201);
    });
  },
];

const logout = [
  (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
      if (err) return next(err);

      req.session.destroy((err) => {
        if (err) return next(err);

        res.clearCookie("connect.sid");
        res.sendStatus(200);
      });
    });
  },
];

export default {
  getLanding,
  login,
  register,
  logout,
};
