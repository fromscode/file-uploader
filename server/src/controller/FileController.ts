import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db/prisma";
import validators from "../middlewares/validators";
import { matchedData, validationResult } from "express-validator";
import BadRequest400 from "../errors/BadRequest400";

const upload = [
  validators.validateFileName("name"),
  validators.validateFIleURL("url"),
  validators.validateFolderId("folderId"),

  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(new BadRequest400(result.array()));
      }

      const { folderId, name, url } = matchedData(req);

      const folder = await prisma.folder.findFirst({
        where: {
          id: folderId,
        },
      });

      if (!folder)
        return res.status(400).json({
          error: "Folder not found",
        });

      if (folder.userId !== req.user!.id) return res.sendStatus(403);

      await prisma.file.create({
        data: {
          name,
          url,
          folderId,
          userId: req.user!.id,
        },
      });

      res.sendStatus(201);
    } catch (err) {
      return next(err);
    }
  },
];

const deleteFile = [
  validators.validateFileId("id", "param"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(new BadRequest400(result.array()));
      }

      const { id } = matchedData(req);

      const file = await prisma.file.findUnique({
        where: { id },
      });

      if (!file)
        return res.status(400).json({
          error: "File not found",
        });

      if (file.userId != req.user!.id) return res.sendStatus(403);

      await prisma.file.delete({
        where: { id },
      });

      res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  },
];

const renameFile = [
  validators.validateFileId("id", "param"),
  validators.validateFileName("name"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return next(new BadRequest400(result.array()));
      }

      const { id, name } = matchedData(req);

      const file = await prisma.file.findUnique({
        where: { id },
      });

      if (!file)
        return res.status(400).json({
          error: "File not found",
        });

      if (file.userId != req.user!.id) return res.sendStatus(403);

      if (file.name === name) return res.sendStatus(201);

      await prisma.file.update({
        data: { name },
        where: { id },
      });

      res.sendStatus(200);
    } catch (err) {
      return next(err);
    }
  },
];

export default {
  upload,
  deleteFile,
  renameFile,
};
