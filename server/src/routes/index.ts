import express from "express";

import auth from "../controller/AuthController";

const router = express.Router();

router.get("/", auth.getLanding);

router.post("/login", auth.login);

router.post("/register", auth.register);

export default router;
