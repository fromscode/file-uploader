import express from "express";

import auth from "../controller/AuthController";
import FolderController from "../controller/FolderController";
import isAuthenticated from "../middlewares/isAuthenticated";
import FileController from "../controller/FileController";

const router = express.Router();

router.get("/", auth.getLanding);

router.post("/login", auth.login);

router.post("/register", auth.register);

router.get("/logout", isAuthenticated, auth.logout);

router.get("/home", isAuthenticated, FolderController.home);

router.post("/create", isAuthenticated, FolderController.create);

router.get("/folder/:id", isAuthenticated, FolderController.getFolder);

router.delete("/folder/:id", isAuthenticated, FolderController.deleteFolder);

router.put("/folder/:id", isAuthenticated, FolderController.renameFolder);

router.post("/upload", isAuthenticated, FileController.upload);

router.delete("/file/:id", isAuthenticated, FileController.deleteFile);

router.put("/file/:id", isAuthenticated, FileController.renameFile);
4;

// TO-DO: Add routes for searching, sorting and filtering folders and files

export default router;
