import express from "express";

import auth from "../controller/AuthController";
import passport from "passport";
import FolderController from "../controller/FolderController";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

router.get("/", auth.getLanding);

router.post("/login", auth.login);

router.post("/register", auth.register);

router.get("/folder", isAuthenticated, FolderController.folder);

export default router;
