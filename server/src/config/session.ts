import expressSession from "express-session";
import { prisma } from "../config/db/prisma.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

export default expressSession({
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
  },
  secret: process.env.secret as string,
  resave: true,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});
