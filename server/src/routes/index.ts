import express from "express";

import auth from "../controller/AuthController";
import FolderController from "../controller/FolderController";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.get("/", auth.getLanding);

router.post("/login", auth.login);

router.post("/register", auth.register);

router.get("/logout", isAuthenticated, auth.logout);

router.get("/home", isAuthenticated, FolderController.home);

router.post("/create", isAuthenticated, FolderController.create);

router.get("/folder/:id", isAuthenticated, FolderController.getFolder);
export default router;
