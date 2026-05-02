import passport from "passport";
import { Strategy } from "passport-local";
import { prisma } from "./db/prisma";

import { User as PrismaUser } from "../generated/prisma/client";

import bcrypt from "bcrypt";

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email: username }],
        },
      });

      if (!user || !(await bcrypt.compare(password, user!.password)))
        return done(null, false);

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) done(null, false);

    done(null, user);
  } catch (err) {
    done(err);
  }
});
