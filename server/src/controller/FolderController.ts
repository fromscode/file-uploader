import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db/prisma";

const home = [
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentFolder = await prisma.folder.findFirst({
        where: {
          userId: req.user!.id,
          parentId: null,
        },
      });

      const folders = await prisma.folder.findMany({
        where: {
          userId: req.user!.id,
          parentId: currentFolder!.id,
        },
      });

      const files = await prisma.file.findMany({
        where: {
          user: req.user,
          folderId: currentFolder!.id,
        },
      });

      res.json({
        currentFolder,
        folders,
        files,
      });
    } catch (err) {
      return next(err);
    }
  },
];

export default {
  home,
};
