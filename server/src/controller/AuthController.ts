import type { Request, Response, NextFunction } from "express";

import bcrypt from "bcrypt";
import { prisma } from "../config/db/prisma.js";

import validators from "../middlewares/validators.js";
import { matchedData, validationResult } from "express-validator";
import BadRequest400 from "../errors/BadRequest400.js";

const MILLISECONDS24HOURS = 24 * 60 * 60 * 1000;

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
    if (!result.isEmpty()) next(new BadRequest400(result.array()));

    const { username, password } = matchedData(req);

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email: username }] },
    });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    )
      return res.sendStatus(401);

    const sid =
      crypto.randomUUID().slice(0, 10) +
      existingUser!.username +
      crypto.randomUUID().slice(11, 20);

    await prisma.session.deleteMany({
      where: {
        userId: existingUser!.id,
      },
    });

    const session = await prisma.session.create({
      data: {
        sid,
        userId: existingUser!.id,
        expiresAt: Date.now() + MILLISECONDS24HOURS,
      },
    });

    res.cookie("sid", session.sid, {
      maxAge: MILLISECONDS24HOURS,
      httpOnly: true,
      sameSite: "lax",
    });

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

    const sid =
      crypto.randomUUID().slice(0, 10) +
      user!.username +
      crypto.randomUUID().slice(11, 20);

    const session = await prisma.session.create({
      data: {
        sid,
        userId: user!.id,
        expiresAt: Date.now() + MILLISECONDS24HOURS,
      },
    });

    res.cookie("sid", session.sid, {
      maxAge: MILLISECONDS24HOURS,
      httpOnly: true,
      sameSite: true,
      secure: true,
    });

    res.sendStatus(201);
  },
];

const logout = [
  async (req: Request, res: Response, next: NextFunction) => {
    const sid = req.sessionID;

    await prisma.session.delete({
      where: {
        sid,
      },
    });

    res.sendStatus(200);
  },
];

export default {
  getLanding,
  login,
  register,
  logout,
};
