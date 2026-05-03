import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db/prisma";
import validators from "../middlewares/validators";
import { matchedData, validationResult } from "express-validator";
import BadRequest400 from "../errors/BadRequest400";

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

const create = [
  validators.validateFolderId("parentId"),
  validators.validateFolderName("folderName"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(new BadRequest400(result.array()));
      }

      const { folderName, parentId } = matchedData(req);

      await prisma.folder.create({
        data: {
          name: folderName,
          parentId: parentId,
          userId: req.user!.id,
        },
      });

      res.sendStatus(201);
    } catch (err) {
      return next(err);
    }
  },
];

const getFolder = [
  validators.validateFolderId("id", "param"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(new BadRequest400(result.array()));
      }

      const { id } = matchedData(req);

      const currentFolder = await prisma.folder.findUnique({
        where: {
          id,
        },
      });

      if (!currentFolder)
        return res.status(400).json({
          error: "folder not found",
        });

      if (currentFolder.userId !== req.user!.id) {
        res.sendStatus(403);
      }

      const folders = await prisma.folder.findMany({
        where: {
          parentId: id,
        },
      });

      const files = await prisma.file.findMany({
        where: {
          folderId: id,
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
  create,
  getFolder,
};
