import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db/prisma";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cookies = req.headers.cookie?.split(";");

  if (!cookies) return res.sendStatus(401);

  let sid = "";

  for (const cookie of cookies) {
    if (cookie.trim().startsWith("sid")) {
      const idx = cookie.indexOf("=");
      sid = cookie.slice(idx + 1);
    }
  }

  if (!sid) return res.sendStatus(401);

  const session = await prisma.session.findFirst({
    where: {
      sid,
    },
  });

  if (!session || session!.expiresAt <= Date.now()) return res.sendStatus(401);

  req.sessionID = sid;

  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
    },
  });

  if (!user) return res.sendStatus(401);

  req.user = user;

  next();
}
